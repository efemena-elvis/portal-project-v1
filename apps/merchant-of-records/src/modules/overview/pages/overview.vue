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
import { ref, computed, onMounted } from "vue";
import { PageContentWrapper } from "@packages/uikit";
import { useEvents } from "@packages/hooks";
import {
  OverviewCard,
  TaxBlock,
  TransactionMetrics,
  TransactionTable,
} from "@/modules/overview/components";
import { useOverviewStore } from "@/modules/overview/store";

const { getWallets } = useOverviewStore();
const { processAPIRequest } = useEvents();

const walletBalance = ref([
  {
    countryFlag: "https://flagsapi.com/US/flat/64.png",
    currencyShort: "USD",
    currencySign: "$",
    amount: 0,
  },
]);

const fetchAllWallets = async () => {
  const response = await processAPIRequest({
    action: getWallets,
    showAlert: false,
  });

  if (response?.code === 200) {
    // walletBalance.value = response.data;
    console.log("Wallets ===> ", response.data);
  }
};

onMounted(() => fetchAllWallets());
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
