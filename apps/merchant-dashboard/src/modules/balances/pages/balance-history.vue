<template>
  <PageContentWrapper
    :pagingData="tablePaging"
    pageDescription="All Balances"
    :pageKeys="{ green: 'Inflow', red: 'Outflow' }"
    @updatePage="(currentPage) => (page = currentPage)"
  >
    <template #pageOptions v-if="!isLoading">
      <DatePicker
        filterSize="lg"
        :activePeriod="activePeriod"
        @onFilterSelected="processFilterSelection"
      />
    </template>
    <template v-slot:pageContent>
      <TableContainer
        :tableHeader="tableHeader"
        :tableBody="tableBody"
        :isLoading="isLoading"
        :emptyData="{
          title: 'No balance history yet',
          description:
            'You haven\'t performed any transaction at the moment. This is where you\'ll be able to see your balance history on all outflow and inflow payments.',
        }"
      >
        <TableContainerBody
          v-for="(payload, index) in tableBody"
          :key="index"
          :tableHeader="tableHeader"
          :tableData="payload"
        />
      </TableContainer>
    </template>
  </PageContentWrapper>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, h } from "vue";
import { useString, useDate, useEvents } from "@packages/hooks";
import { TableHeaderType } from "@packages/models";
import { useBalanceStore } from "../store";
import { DatePicker } from "@packages/uikit";

import {
  TableContainer,
  TableContainerBody,
  PageContentWrapper,
  TableDoubleColumn,
} from "@packages/uikit";
import { watch } from "vue";

const {
  formatNumber,
  getBoldTableText,
  capitalizeFirstLetter,
  transactionFlowIcon,
} = useString();
const { getBalanceHistory } = useBalanceStore();
const { processAPIRequest } = useEvents();

const isLoading = ref(true);
const activePeriod = ref<[Date, Date] | null>(null);
const tableHeader = ref<TableHeaderType[]>([
  { title: "", slug: "status" },
  { title: "Date Created", slug: "date_created" },
  { title: "Action", slug: "action" },
  { title: "Balance Before", slug: "balance_before" },
  { title: "Change", slug: "change" },
  { title: "Balance After", slug: "balance_after" },
]);

const tableBody = ref<any[]>([]);

const tablePaging = ref<any>({});
const page = ref<number>(1);

const filters = computed(
  () =>
    `?page=${page.value}&from=${activePeriod.value ? activePeriod.value[0].toISOString().split("T")[0] : ""}&to=${activePeriod.value ? activePeriod.value[1].toISOString().split("T")[0] : ""}`
);

const getTransactionDate = (date: string) => {
  let { w2, m3, d3, y1 } = useDate.formatDate(date).getAll();
  return `${w2}, ${d3} ${m3}, ${y1}`;
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

const fetchBalanceHistory = async (filters: string) => {
  isLoading.value = true;
  tablePaging.value.current_page = page;
  const response = await processAPIRequest({
    action: getBalanceHistory,
    payload: { filters, page: page.value },
    showAlert: false,
  });

  isLoading.value = false;

  if (response.code === 200) {
  tableBody.value = response.data.map((data: any) => {
  return {
    raw_date: data.balance_at,
    status: transactionFlowIcon(
      data.type === "credit" ? "receive" : "send"
    ),
    date_created: h(TableDoubleColumn, {
      entry: {
        primaryText: getTransactionDate(data.balance_at),
        secondaryText: useDate.formatTime(data.balance_at),
      },
    }),
    action: capitalizeFirstLetter(data.action.split("-").join(" ")),
    balance_before: `${data.currency_code} ${formatNumber(data.balance_before)}`,
    change: getBoldTableText(
      `${data.currency_code} ${formatNumber(data.amount)}`,
      data.type === "credit" ? "text-green-600" : "text-red-600"
    ),
    balance_after: `${data.currency_code} ${formatNumber(data.balance_after)}`,
    reference: data.reference,
  };
});


    tablePaging.value = response.pagination[0];
  }
};

watch(activePeriod, () => {
  page.value = 1;
});

watch(filters, (newFilters) => {
  fetchBalanceHistory(newFilters);
});

onMounted(fetchBalanceHistory);
</script>
