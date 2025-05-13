<template>
    <div class="overview-card">
 <TransactionMetrics  />
    </div>
</template>

<script setup lang="ts">
import TransactionMetrics from './transaction-metrics.vue';




</script>

<style lang="scss" scoped>
.overview-card {
  @apply w-full lg:h-[150px] sm:h-fit my-8 rounded-xl  bg-teal-100 px-6 py-5;

}
</style>