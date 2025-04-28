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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, h } from "vue";
import { TableHeaderType } from "@packages/models";
import {
  TableContainer,
  TableContainerBody,
  TableDoubleColumn,
} from "@packages/uikit";
import { useString } from "@packages/hooks";

const { formatNumber, getStatus } = useString();

const isLoading = ref(false);

const tableHeader = ref<TableHeaderType[]>([
  { title: "Product Details", slug: "product" },
  { title: "Amount Per Unit", slug: "amount" },
  { title: "Stock", slug: "quantity" },
  { title: "Status", slug: "status" },
]);

const tableBody = reactive<any[]>([
  {
    product: h(TableDoubleColumn, {
      entry: {
        primaryText: "Bolaji Babalola",
        secondaryText: "chditwee@gmail.com",
      },
    }),
    amount: `ZMW${formatNumber(500000)}`,
    quantity: 25,
    status: `${getStatus("success", "Successful")}`,
  },
  {
    product: h(TableDoubleColumn, {
      entry: {
        primaryText: "Bolaji Babalola",
        secondaryText: "chditwee@gmail.com",
      },
    }),
    amount: `ZMW${formatNumber(500000)}`,
    quantity: 25,
    status: `${getStatus("success", "Successful")}`,
  },
]);
</script>

<style lang="scss" scoped>
.transaction-table {
  @apply w-full h-auto rounded-2xl p-6 pb-7 bg-grey-50/80;

  .title-row {
    @apply font-semibold text-lg text-grey-900 mb-4;
  }
}
</style>
