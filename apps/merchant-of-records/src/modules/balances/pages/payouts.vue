<template>
  <PageContentWrapper>
    <template #pageOptions v-if="tableBody.length > 0 && !isLoading">
    
    
     <div class="relative w-48 sm:w-1/2 border rounded-md bg-grey-50/80 cursor-pointer text-sm font-semibold text-teal-800  ">
        <select
          v-model="selectedStatus"
          class=" appearance-none w-full p-4 bg-transparent focus:outline-none"
        >
          <option value="">Status</option>
          <option
            v-for="(status, index) in statusOptions"
            :value="status.toLowerCase()"
            :key="index"
          >
            {{ status }}
          </option>
        </select>
        <div
          class="absolute text-[16px] text-teal-800 -translate-y-1/2 pointer-events-none icon icon-caret-down right-4 top-1/2"
        ></div>
      </div>

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
          title: 'No payout initiated yet',
          description:
            'You haven\'t initiated any payout yet. This is where you\'ll be able to see all your initiated payout transactions.',
          actionText: 'Initiate a Payout',
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
import { ref, computed, onMounted } from "vue";
import { useString, useEvents, useDate } from "@packages/hooks";
import { useBalanceStore } from "@/modules/balances/store";
import { TableHeaderType } from "@packages/models";
import { DatePicker } from "@packages/uikit";
import {
  TableContainer,
  TableContainerBody,
  PageContentWrapper,
} from "@packages/uikit";

const { getBoldTableText, formatNumber, getStatus } = useString();
const { fetchAllPayouts } = useBalanceStore();
const { processAPIRequest } = useEvents();

const isLoading = ref(true);
const selectedStatus = ref("");

const activePeriod = ref<[Date, Date] | null>(null);
const showDropdown = ref(false);

const statusOptions = ["Successful", "Pending", "Failed"];

const tableHeader = ref<TableHeaderType[]>([
  { title: "Date Initiated", slug: "date_created" },
  { title: "Payout Reference", slug: "reference_id" },
  { title: "Amount Requested", slug: "amount_requested" },
  { title: "Payout Narration", slug: "narration" },
  { title: "Status", slug: "status" },
]);

const tableBody = ref<any[]>([]);
const tablePaging = ref<any>({});

const getDateCreated = (date: string) => {
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

const fetchPayouts = async () => {
  const response = await processAPIRequest({
    action: fetchAllPayouts,
    payload: {},
    showAlert: false,
  });

  isLoading.value = false;

  if (response.code === 200) {
    tableBody.value = response.data.map((data: any) => ({
      raw_date: data.created_at,
      raw_status: data.status,
      date_created: getDateCreated(data.created_at),
      reference_id: data.reference,
      amount_requested: getBoldTableText(
        `${data.currency} ${formatNumber(data.amount)}`
      ),
      narration: data.narration,
      status: getStatus(data.status, data.status),
    }));

    tablePaging.value = response.pagination[0];
  }
};

const filteredTableBody = computed(() => {
  return tableBody.value.filter((tx) => {
    const rawDate = tx.raw_date ? new Date(tx.raw_date) : null;
    const matchesStatus = selectedStatus.value
      ? tx.raw_status?.toLowerCase() === selectedStatus.value.toLowerCase()
      : true;
    const matchesDate = rawDate ? isWithinRange(rawDate, activePeriod.value) : true;
    return matchesStatus && matchesDate;
  });
});

onMounted(() => {
  fetchPayouts();
});


</script>

<style scoped>

 </style>