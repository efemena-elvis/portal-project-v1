<template>
  <div class="transaction-table">
    <div class="title-row">Recent Transactions</div>

    <TableContainer
      :tableHeader="tableHeader"
      :tableBody="tableBody"
      :isLoading="isLoading"
      :showTableHeader="false"
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
      <div class="button-row flex justify-center items-center">
        <router-link
          to="#"
          class="btn btn-primary btn-sm hover:text-neutral-10  !w-[150px] "
        >
          <div class="text-xl font-semibold"></div>
         Perform a test transaction
        </router-link>
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, h, onMounted } from "vue";
import { TableHeaderType } from "@packages/models";
import {
  TableContainer,
  TableContainerBody,
  TableDoubleColumn,
} from "@packages/uikit";
import { useString, useEvents, useDate } from "@packages/hooks";
import { usePaymentStore } from "@/modules/payments/store";

const { formatNumber, getStatus } = useString();
const { processAPIRequest } = useEvents();
const { getTransactions } = usePaymentStore();

const isLoading = ref(false);

const tableHeader = ref<TableHeaderType[]>([
  { title: "Product Details", slug: "product" },
  { title: "Amount Per Unit", slug: "amount" },
  { title: "Stock", slug: "quantity" },
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
  // console.log(response);
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
        payment_details: h(TableDoubleColumn, {
          entry: {
            primaryText: capitalizeFirstLetter(data.method),
            secondaryText: `Type: ${
              data.redirect_url.startsWith("https://store.redstonepgs.com/")
                ? "Storefront"
                : "Third party"
            }`,
          },
        }),
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
  @apply w-full h-auto rounded-2xl p-6 pb-7 bg-grey-50/80;

  .title-row {
    @apply font-semibold text-lg text-grey-900 mb-4;
  }
}
</style>
