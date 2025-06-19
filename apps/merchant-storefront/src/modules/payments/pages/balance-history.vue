<template>
  <PageContentWrapper>
    <template v-slot:pageContent>
      <TableContainer
        :tableHeader="tableHeader"
        :tableBody="tableBody"
        :isLoading="isLoading"
        :emptyData="{
          title: 'No balance history yet',
          description:
            'You haven\'t performed any transaction at the moment. This is where you\'ll be able to see your payment outflow and inflow.',
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
import { ref, reactive, onMounted } from "vue";
import { useString, useDate, useEvents } from "@packages/hooks";
import { TableHeaderType } from "@packages/models";
import { usePaymentStore } from "@/modules/payments/store";
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
const { getBalanceHistory } = usePaymentStore();
const { processAPIRequest } = useEvents();

const isLoading = ref(true);

const tableHeader = ref<TableHeaderType[]>([
  { title: "Date Created", slug: "date_created" },
  { title: "Transaction Summary", slug: "summary" },
  { title: "Market Wallet", slug: "wallet" },
  { title: "Balance Before", slug: "balance_before" },
  { title: "Change", slug: "change" },
  { title: "Balance After", slug: "balance_after" },
]);

const tableBody = reactive<any[]>([
  // {
  //   date_created: "22nd July, 2024",
  //   summary: "Collection charge",
  //   wallet: "NGN Wallet",
  //   balance_before: "NGN 20,000.00",
  //   change: getBoldTableText("NGN 1,000.00"),
  //   balance_after: "NGN 21,000.00",
  // },
]);
const tablePaging = ref<any>({});

const getTransactionDate = (date: string) => {
  let { w2, m3, d3, y1 } = useDate.formatDate(date).getAll();
  return `${w2}, ${d3} ${m3}, ${y1}`;
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
      });
    });

    tablePaging.value = response.pagination[0];
  }
};

onMounted(() => {
  fetchBalanceHistory();
});
</script>
