<template>
  <div class="metric-item" :class="metricStyle">
    <div class="metric-title">{{ props.metricTitle }}</div>

    <div class="metric-value">
      {{ props.metricValue }}
    </div>

    <div class="metric-stat">
      {{ props.metricPercentageChange }} (Last Month)
    </div>
  </div>
</template>

<script setup lang="ts">
interface IMetricProps {
  metricStyle: string;
  metricTitle: string;
  metricValue: string;
  metricPercentageChange: string;
}

const props = withDefaults(defineProps<IMetricProps>(), {
  metricStyle: "bg-white",
  metricTitle: "Metric Title",
  metricValue: "0",
  metricPercentageChange: "0%",
});
</script>

<style lang="scss" scoped>
.metric-item {
  @apply border overflow-hidden rounded-[10px] px-5 py-6 flex flex-col justify-center items-start gap-y-0.5;

  .metric-title {
    @apply text-grey-600 font-medium text-[13px] mb-2.5;
  }

  .metric-value {
    @apply text-[22px] font-bold text-grey-800;
  }

  .metric-stat {
    @apply text-[12.5px] text-green-600 font-medium;
  }
}
</style>
