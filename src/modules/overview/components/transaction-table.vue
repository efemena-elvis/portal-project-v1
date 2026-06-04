<template>
  <div class="transaction-table">
    <div class="title-row">Recent Transactions</div>

    <TableContainer
      :tableHeader="tableHeader"
      :tableBody="tableBody"
      :isLoading="isLoading"
      :emptyData="{
        title: 'No transactions yet!',
        description: 'No transactions has been initiated on your account yet',
      }"
    >
      <TableContainerBody
        v-for="(payload, index) in tableBody"
        :key="index"
        :tableHeader="tableHeader"
        :tableData="payload"
      />
    </TableContainer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, h, onMounted } from "vue";
import { TableHeaderType } from "@packages/models";
import { useString, useEvents, useDate } from "@packages/hooks";
import { usePaymentStore } from "@/modules/payments/store";
import {
  TableContainer,
  TableContainerBody,
  TableDoubleColumn,
} from "@packages/uikit";

const { formatNumber, getStatus, notAvailable, capitalizeFirstLetter } =
  useString();
const { processAPIRequest } = useEvents();
const { getTransactions } = usePaymentStore();

const isLoading = ref(true);

const tableHeader = ref<TableHeaderType[]>([
  { title: "Transaction Date", slug: "date_created" },
  { title: "Customer Details", slug: "customer_details" },
  { title: "Amount", slug: "amount" },
  { title: "Payment Method", slug: "payment_details" },
  { title: "Status", slug: "status" },
]);

const tableBody = reactive<any[]>([]);
const tablePaging = ref<any>({});

const getTransactionDate = (date: string) => {
  const { w2, m3, d3, y1 } = useDate.formatDate(date).getAll();
  return `${w2}, ${d3} ${m3}, ${y1}`;
};

const fetchPaymentTransactions = async (page = 1) => {
  tablePaging.value.current_page = page;
  const response = await processAPIRequest({
    action: getTransactions,
    payload: { page },
    showAlert: false,
  });

  isLoading.value = false;

  if (response?.code === 200) {
    response.data.slice(0, 5).map((data: any) => {
      tableBody.push({
        date_created: h(TableDoubleColumn, {
          entry: {
            primaryText: getTransactionDate(data.created_at),
            secondaryText: useDate.formatTime(data.created_at),
          },
        }),
        customer_details: data.customer
          ? h(TableDoubleColumn, {
              entry: {
                primaryText: `${data.customer.firstname} ${data.customer.lastname}`,
                secondaryText: data.customer.email,
              },
            })
          : notAvailable("No customer info"),
        amount: h(TableDoubleColumn, {
          entry: {
            primaryText: `${data.currency} ${formatNumber(data.amount)}`,
            secondaryText: `Charge: ${data.currency} ${formatNumber(data.charge)}`,
          },
        }),
        payment_details: capitalizeFirstLetter(data.method),
        status: getStatus(data.status, data.status),
      });
    });

    tablePaging.value = response.pagination[0];
  }
};

onMounted(() => {
  fetchPaymentTransactions();
});
</script>

<style lang="scss" scoped>
.transaction-table {
  @apply w-full h-auto rounded-2xl;

  .title-row {
    @apply font-semibold text-xl text-grey-900 mb-4;
  }
}
</style>
