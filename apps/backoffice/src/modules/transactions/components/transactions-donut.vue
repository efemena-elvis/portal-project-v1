<template>
  <div class="donut-section">
    <div class="donut-wrapper">
      <DoughnutChart
        :data="donutData"
        :backgroundColors="['#3ab75d', '#eea41a', '#d6341b']"
        :height="240"
        :legendBoxSize="8"
        :legendPadding="8"
      />
      <div class="donut-total-card">
        <span class="donut-total-label">Total</span>
        <span class="donut-total-value">100%</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from "vue";
import { DoughnutChart } from "@packages/uikit";
import type { TransactionPercentages } from "@/modules/transactions/composables/useTransactionsData";

const props = defineProps<{
  percentages: TransactionPercentages;
}>();

const donutData = computed(() => [
  {
    country: "Completed",
    amount: Math.round(props.percentages.Completed || 0),
  },
  { country: "Pending", amount: Math.round(props.percentages.Pending || 0) },
  { country: "Failed", amount: Math.round(props.percentages.Failed || 0) },
]);
</script>

<style scoped lang="scss">
.donut-section {
  @apply w-[320px];
}

.donut-wrapper {
  @apply relative z-0;
}

.donut-total-card {
  @apply absolute left-1/2 top-[46.3%] w-[192px] h-[192px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F1F7F6] flex flex-col items-center justify-center py-4 -z-10;
}

.donut-total-label {
  @apply text-sm text-grey-500;
}

.donut-total-value {
  @apply text-sm font-semibold text-grey-900;
}
</style>
