<template>
  <div class="transaction-metrics">
    <div class="transaction-data">
      <div class="title-text">All Transactions</div>
      <div class="value-text">
        {{ transactionStats?.total_transactions || 0 }}
      </div>
    </div>

    <div class="transaction-data">
      <div class="title-text">Successful Transactions</div>
      <div class="value-text">
        {{ getCurrency }}
        {{ formatNumber(transactionStats?.successful_transactions_value ?? 0) || 0 }}
      </div>
    </div>

    <div class="transaction-data">
      <div class="title-text">Total Payouts</div>
      <div class="value-text">
        <span
          >{{ getCurrency }}
          {{ formatNumber(transactionStats?.total_payouts_value || 0)}}</span
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  
import { useString, useAppVariant} from "@packages/hooks";
import { computed, ref } from "vue";

const { formatNumber } = useString();
const appVariant = ref<string>(useAppVariant());

const getCurrency = computed(() => {
  return appVariant.value === "alexpay" ? "GHS" : "ZMW";
});

interface ITransactionStats {
  total_transactions: number;
  successful_transactions_value: number;
  total_payouts_value: number;
}

const props = defineProps<{
  transactionStats: ITransactionStats | null;
}>();
</script>

<style lang="scss" scoped>
.transaction-metrics {
  @apply w-full grid grid-cols-3;

  .transaction-data {
    @apply flex flex-col justify-start items-start gap-2;

    .title-text {
      @apply text-[13px] text-grey-500;
    }

    .value-text {
      @apply text-xl font-semibold text-grey-900;
    }
  }
}
</style>
