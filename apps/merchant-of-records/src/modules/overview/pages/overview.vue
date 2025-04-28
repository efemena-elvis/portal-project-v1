<template>
  <PageContentWrapper>
    <template v-slot:pageContent>
      <!-- OVERFLOW ROW -->
      <div class="overflow-row">
        <OverviewCard
          v-for="(wallet, index) in walletBalance"
          :key="index"
          :wallet="wallet"
        />
      </div>

      <!-- TAX ROW -->
      <div class="tax-row">
        <div class="tax-row--left">
          <TaxBlock />
        </div>

        <div class="tax-row--right">
          <TransactionMetrics />
        </div>
      </div>

      <!-- TRANSACTION ROW -->
      <div class="transaction-row">
        <TransactionTable />
      </div>
    </template>
  </PageContentWrapper>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { PageContentWrapper } from "@packages/uikit";
import {
  OverviewCard,
  TaxBlock,
  TransactionMetrics,
  TransactionTable,
} from "@/modules/overview/components";

const walletBalance = ref([
  {
    countryFlag: "https://flagsapi.com/US/flat/64.png",
    currencyShort: "USD",
    currencySign: "$",
    amount: 52000,
  },
  {
    countryFlag: "https://flagsapi.com/ZM/flat/64.png",
    currencyShort: "ZMW",
    currencySign: "ZK",
    amount: 100000,
  },
]);
</script>

<style lang="scss" scoped>
.overflow-row {
  @apply flex justify-start items-center gap-8 mb-9;
}

.tax-row {
  @apply flex justify-between items-center gap-8 mb-9;

  &--left {
    @apply w-1/2;
  }

  &--right {
    @apply w-1/2;
  }
}
</style>
