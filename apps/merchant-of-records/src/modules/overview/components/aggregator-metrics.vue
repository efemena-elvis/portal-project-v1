<template>
  <div class="aggregator-metrics">
    <div class="transaction-data">
      <div class="title-text">Total transactions</div>
      <div class="value-text">0</div>
    </div>

    <div class="transaction-data">
      <div class="title-text">Number of merchants</div>
      <div class="value-text">0</div>
    </div>

    <div class="transaction-data">
      <div class="title-text">Pending approval</div>
      <div class="value-text">0</div>
    </div>

    <div class="transaction-data">
      <div class="title-text">Total Payout</div>
      <div class="value-text">
        <!-- <span class="mr-0.5">ZK</span> -->
        <span>0</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.aggregator-metrics {
  @apply grid grid-cols-4 sm:grid-cols-2 gap-x-8 sm:gap-x-6 sm:gap-y-6 px-6 py-7  rounded-xl bg-teal-50 border border-teal-100 mt-4 mb-8;

  .transaction-data {
    @apply flex flex-col justify-start items-start gap-2 h-auto p-6 pb-5 bg-neutral-10 rounded-xl;

    .title-text {
      @apply text-sm text-grey-500;
    }

    .value-text {
      @apply text-2xl font-semibold text-grey-900;
    }
  }
}
</style>
