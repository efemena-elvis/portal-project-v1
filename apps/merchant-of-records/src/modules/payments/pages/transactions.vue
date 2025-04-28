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
    </template>
  </PageContentWrapper>
</template>

<script setup lang="ts">
import { ref, reactive, h } from "vue";
import { TableHeaderType } from "@packages/models";
import { useString } from "@packages/hooks";
import {
  TableContainer,
  TableContainerBody,
  TableDoubleColumn,
  PageContentWrapper,
} from "@packages/uikit";

const { formatNumber, getStatus, getBoldTableText } = useString();

const isLoading = ref(false);

const tableHeader = ref<TableHeaderType[]>([
  { title: "Transaction Info", slug: "info" },
  { title: "Customer Details", slug: "customer" },
  { title: "Payment Method", slug: "payment_method" },
  { title: "Amount", slug: "amount" },
  { title: "Status", slug: "status" },
]);

const tableBody = reactive<any[]>([
  {
    info: h(TableDoubleColumn, {
      entry: {
        primaryText: "Tue, 12th April 2025",
        secondaryText: "Ref: 327-1231-33212",
      },
    }),
    customer: h(TableDoubleColumn, {
      entry: {
        primaryText: "Bolaji Babalola",
        secondaryText: "chditwee@gmail.com",
      },
    }),
    payment_method: "Mastercard",
    amount: getBoldTableText(`ZMW ${formatNumber(500000)}`),
    status: `${getStatus("success", "Successful")}`,
  },
  {
    info: h(TableDoubleColumn, {
      entry: {
        primaryText: "Wed, 13th April 2025",
        secondaryText: "Ref: 320-1231-45390",
      },
    }),
    customer: h(TableDoubleColumn, {
      entry: {
        primaryText: "Bolaji Babalola",
        secondaryText: "chditwee@gmail.com",
      },
    }),
    payment_method: "Mobile money",
    amount: getBoldTableText(`ZMW ${formatNumber(250000)}`),
    status: `${getStatus("success", "Successful")}`,
  },
]);
</script>

<style lang="scss" scoped>
.button-row {
  @apply flex justify-end items-center gap-x-2;

  .btn {
    @apply py-2.5 px-5 h-10;
  }
}
</style>
