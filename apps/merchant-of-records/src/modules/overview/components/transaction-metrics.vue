<template>
  <div class="transaction-metrics">
    <div class="transaction-data">
      <div class="title-text">Transactions</div>
      <div class="value-text">0</div>
    </div>

    <div class="transaction-data">
      <div class="title-text">Successful Transactions</div>
      <div class="value-text">0</div>
    </div>

    <div class="transaction-data">
      <div class="title-text">Failed Transactions</div>
      <div class="value-text">0</div>
    </div>

    <div class="transaction-data">
      <div class="title-text">Total Payouts</div>
      <div class="value-text">
        <span class="mr-0.5">ZK</span>
        <span>0</span>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.transaction-metrics {
  @apply w-full grid grid-cols-2 gap-8;

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
