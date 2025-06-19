<template>
  <div class="transaction-metrics">
    <div class="transaction-data">
      <div class="title-text">Total transactions</div>
      <div class="value-text">0</div>
    </div>

    <div class="transaction-data">
      <div class="title-text">Number of merchants</div>
      <div class="value-text">0</div>
    </div>

    <div class="transaction-data">
      <div class="title-text"> Pending approval</div>
      <div class="value-text">0</div>
    </div>

    <div class="transaction-data">
      <div class="title-text"> Payout</div>
      <div class="value-text">
        <!-- <span class="mr-0.5">ZK</span> -->
        <span>0</span>
      </div>

    </div>
 
  </div>
  
</template>

<script setup lang = "ts">


</script>


<style lang="scss" scoped>
.transaction-metrics {
  @apply grid grid-cols-4 gap-x-12  sm:gap-x-6 sm:gap-y-6 p-4 sm:grid-cols-2;

  .transaction-data {
    @apply flex flex-col justify-start items-start gap-6 h-[100px] p-6 bg-neutral-10 rounded-xl;

    .title-text {
      @apply text-sm text-grey-500 ;
    }

    .value-text {
      @apply text-xl font-semibold text-grey-900;
    }
  }
}
</style>
