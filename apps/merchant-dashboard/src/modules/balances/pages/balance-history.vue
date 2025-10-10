<template>
  <PageContentWrapper>
           <template #pageOptions v-if="tableBody.length > 0 && !isLoading">
          <DatePicker  
          filterSize="lg"
          :activePeriod="activePeriod"
          @onFilterSelected="processFilterSelection"/>
    
    </template>
    <template v-slot:pageContent>
      <TableContainer
        :tableHeader="tableHeader"
        :tableBody="filteredTableBody"
        :isLoading="isLoading"
        :emptyData="{
          title: 'No balance history yet',
          description:
            'You haven\'t performed any transaction at the moment. This is where you\'ll be able to see your balance history on all outflow and inflow payments.',
        }"
      >
        <TableContainerBody
          v-for="(payload, index) in filteredTableBody"
          :key="index"
          :tableHeader="tableHeader"
          :tableData="payload"
        />
      </TableContainer>
    </template>
  </PageContentWrapper>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed} from "vue";
import { useString, useDate, useEvents } from "@packages/hooks";
import { TableHeaderType } from "@packages/models";
import { useBalanceStore } from "../store";
import { DatePicker } from "@packages/uikit";
import {
  TableContainer,
  TableContainerBody,
  PageContentWrapper,
} from "@packages/uikit";

const {
  formatNumber,
  getStatus,
  getBoldTableText,
  capitalizeFirstLetter,
  transactionFlowIcon,
} = useString();
const { getBalanceHistory } = useBalanceStore();
const { processAPIRequest } = useEvents();

const isLoading = ref(true);
const activePeriod = ref<[Date, Date] | null>(null);
const tableHeader = ref<TableHeaderType[]>([
  { title: "Date Created", slug: "date_created" },
  { title: "Transaction Summary", slug: "summary" },
  { title: "Balance Before", slug: "balance_before" },
  { title: "Change", slug: "change" },
  { title: "Balance After", slug: "balance_after" },
]);

const tableBody = reactive<any[]>([]);

const tablePaging = ref<any>({});

const getTransactionDate = (date: string) => {
  let { w2, m3, d3, y1 } = useDate.formatDate(date).getAll();
  return `${w2}, ${d3} ${m3}, ${y1}`;
};

const normalizeDate = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const isWithinRange = (date: Date, range: [Date, Date] | null): boolean => {
  if (!range || !range[0] || !range[1]) return true;

  const start = normalizeDate(new Date(range[0]));
  const end = new Date(range[1]);
  end.setHours(23, 59, 59, 999); 

  const target = new Date(date);
  return target >= start && target <= end;
};


const processFilterSelection = (
  selectedRange: [Date | string, Date | string]
) => {
  if (selectedRange && selectedRange.length === 2) {
    const normalizedRange: [Date, Date] = [
      new Date(selectedRange[0]),
      new Date(selectedRange[1]),
    ];
    activePeriod.value = normalizedRange;
  } else {
    activePeriod.value = null;
  }
};


const fetchBalanceHistory = async () => {
  const response = await processAPIRequest({
    action: getBalanceHistory,
    payload: {},
    showAlert: false,
  });

  isLoading.value = false;

  if (response.code === 200) {
    response.data.map((data: any) => {
      tableBody.push({
        raw_date: data.balance_at, 
        status: transactionFlowIcon(
          data.type === "credit" ? "receive" : "send"
        ),
        date_created: getTransactionDate(data.balance_at),
        summary: capitalizeFirstLetter(data.action.split("-").join(" ")),
        balance_before: `ZMW ${formatNumber(data.balance_before)}`,
        change: getBoldTableText(
          `ZMW ${formatNumber(data.amount)}`,
          data.type === "credit" ? "text-green-600" : "text-red-600"
        ),
        balance_after: `ZMW ${formatNumber(data.balance_after)}`,
        reference : data.reference
      });
    });

    tablePaging.value = response.pagination[0];
  }
};

const filteredTableBody = computed(() => {
  return tableBody.filter((tx) => {
    const rawDate = tx.raw_date ? new Date(tx.raw_date) : null;
    const matchesDate = rawDate ? isWithinRange(rawDate, activePeriod.value) : true;
    
  
      
    return matchesDate ;
  });
});

onMounted(() => {
  fetchBalanceHistory();
});
</script>
