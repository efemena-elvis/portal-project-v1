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
      <div
        class="value-text"
        v-for="(transactionStat, index) in transactionStats?.currency_stats"
        :key="index"
      >
        {{ transactionStat.currency
        }} {{
          formatNumber(transactionStat?.successful_transactions_value ?? 0) 
        }}
      </div>
    </div>

    <div class="transaction-data">
      <div class="title-text">Total Payouts</div>
      <div
        class="value-text"
        v-for="(transactionStat, index) in transactionStats?.currency_stats"
        :key="index"
      >
        <span
          >{{ transactionStat.currency
          }} {{ formatNumber(transactionStat?.total_payouts_value ?? 0) }}</span
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useString } from "@packages/hooks";

const { formatNumber } = useString();

interface ITransactionStats {
  total_transactions: number;
  currency_stats: Array<{
    successful_transactions_value: number;
    total_payouts_value: number;
    currency: string;
  }>;
}

const props = defineProps<{
  transactionStats: ITransactionStats ;
}>();
</script>

<style lang="scss" scoped>
.transaction-metrics {
  @apply w-full grid grid-cols-3 gap-4;

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
