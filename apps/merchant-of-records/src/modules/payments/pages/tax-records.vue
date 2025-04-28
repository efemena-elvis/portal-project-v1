<template>
  <PageContentWrapper>
    <template v-slot:pageContent>
      <div class="tax-balance-row">
        <TaxBalanceCard />
      </div>

      <!-- TAX TABLE BLOCK -->
      <div class="tax-table-block">
        <div class="title-text">Transaction Taxes</div>

        <div class="category-body">
          <TableContainer
            :tableHeader="tableHeader"
            :tableBody="tableBody"
            :isLoading="isLoading"
            :emptyData="{
              title: 'No transactions yet!',
              description:
                'No transactions has been initiated on your account yet',
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
      </div>
    </template>
  </PageContentWrapper>
</template>

<script setup lang="ts">
import { ref, reactive, h } from "vue";
import { TaxBalanceCard } from "@/modules/payments/components";
import { TableHeaderType } from "@packages/models";
import { useString } from "@packages/hooks";
import {
  TableContainer,
  TableContainerBody,
  PageContentWrapper,
} from "@packages/uikit";

const { formatNumber, getStatus } = useString();

const isLoading = ref(false);

const tableHeader = ref<TableHeaderType[]>([
  { title: "Date Created", slug: "date_created" },
  { title: "Reference ID", slug: "reference" },
  { title: "Amount", slug: "amount" },
  { title: "Tax", slug: "tax" },
  { title: "Status", slug: "status" },
]);

const tableBody = reactive<any[]>([
  {
    date_created: "Tue, 12th April 2025",
    reference: "3202-1231-45390",
    amount: `ZMW${formatNumber(500000)}`,
    tax: `ZMW${formatNumber(2500)}`,
    status: `${getStatus("success", "Successful")}`,
  },
  {
    date_created: "Mon, 19th April 2025",
    reference: "3202-3145-45390",
    amount: `ZMW${formatNumber(250000)}`,
    tax: `ZMW${formatNumber(1250)}`,
    status: `${getStatus("success", "Successful")}`,
  },
]);
</script>

<style lang="scss" scoped>
.tax-balance-row {
  @apply flex justify-between items-center gap-8 mb-9;
}

.tax-table-block {
  @apply w-full;

  .title-text {
    @apply text-lg font-semibold text-grey-800 mb-7;
  }
}
</style>
