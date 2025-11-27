<template>
  <div class="transaction-metrics">
    <div class="transaction-data">
      <div class="title-text">All Transactions</div>
      <div class="value-text">{{ transactionStats?.total_transactions || 0 }}</div>
    </div>

    <div class="transaction-data">
      <div class="title-text">Successful Transactions</div>
      <div class="value-text">{{currency}}{{ formatNumber(transactionStats?.successful_transactions_value ?? 0) }}</div>
    </div>

    <div class="transaction-data">
      <div class="title-text">Total Payouts</div>
      <div class="value-text">
        <span>{{currency}}{{ formatNumber(transactionStats?.total_payouts_value ?? 0) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useString } from '@packages/hooks';

const {formatNumber} = useString();

interface ITransactionStats {
  total_transactions: number;
  successful_transactions_value: number;
  failed_transactions: number;
  total_payouts_value: number;
 
}

const props = defineProps<{
  transactionStats: ITransactionStats | null;
  currency: string;
}>();

</script>



<style lang="scss" scoped>
.transaction-metrics {
  @apply w-full grid grid-cols-3 ;

  .transaction-data {
    @apply flex flex-col justify-start items-start gap-2;

    .title-text {
      @apply text-sm text-grey-500;
    }

    .value-text {
      @apply text-xl font-semibold text-grey-900;
    }
  }
}
</style>
