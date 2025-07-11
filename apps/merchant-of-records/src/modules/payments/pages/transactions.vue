<template>
  <PageContentWrapper>
    <template v-slot:pageOptions>
      <div class="button-row">
        <button class="btn btn-secondary">Export</button>
      </div>
    </template>

    <template v-slot:pageContent>
      <TableContainer
        :tableHeader="tableHeader"
        :tableBody="tableBody"
        :isLoading="isLoading"
        :emptyData="{
          title: 'No transactions yet!',
          description:
            'No transactions has been initiated on your account yet.',
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
import { ref, reactive, h, onMounted, computed } from "vue";
import { TableHeaderType } from "@packages/models";
import { useDate, useString, useEvents } from "@packages/hooks";
import { usePaymentStore } from "@/modules/payments/store";

import {
  TableContainer,
  TableContainerBody,
  TableDoubleColumn,
  PageContentWrapper,
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
  let { w2, m3, d3, y1 } = useDate.formatDate(date).getAll();
  return `${w2}, ${d3} ${m3}, ${y1}`;
};

const fetchPaymentTransactions = async () => {
  const response = await processAPIRequest({
    action: getTransactions,
    payload: {},
    showAlert: false,
  });

  isLoading.value = false;

  if (response?.code === 200) {
    response.data.map((data: any) => {
      tableBody.push({
        date_created: getTransactionDate(data.created_at),
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
.button-row {
  @apply flex justify-end items-center gap-x-2;

  .btn {
    @apply py-2.5 px-5 h-10;
  }
}
</style>
