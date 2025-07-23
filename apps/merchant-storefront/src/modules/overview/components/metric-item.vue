<template>
  <div class="metric-item" :class="metricStyle">
    <div class="metric-title">{{ props.metricTitle }}</div>

    <div class="metric-value">
      <span v-if="metricTitle === 'Total Sales'">ZMW</span>
      {{ Number(metricValue).toLocaleString() }}
    </div>

    <div
      class="metric-stat"
     
    >
      <span  :class="{
        'text-red-500': metricValue < 50,
        'text-green-600': metricValue >= 50,
      }">{{ props.metricPercentageChange }}</span> (Past 30 days)
    </div>
  </div>
</template>


<script setup lang="ts">
interface IMetricProps {
  metricStyle: string;
  metricTitle: string;
  metricValue: number;
  metricPercentageChange: string;
}

const props = withDefaults(defineProps<IMetricProps>(), {
  metricStyle: "bg-white",
  metricTitle: "Metric Title",
  metricValue: 0,
  metricPercentageChange: "0%",
});
</script>

<style lang="scss" scoped>
.metric-item {
  @apply border overflow-hidden rounded-[10px] px-5 py-6 flex flex-col justify-center items-start gap-y-0.5 h-[128Ppx];

  .metric-title {
    @apply text-grey-600 font-medium text-sm mb-2.5;
  }

  .metric-value {
    @apply text-[22px] font-bold text-grey-800;
  }

  .metric-stat {
    @apply text-[12.5px]  font-medium;
  }
}
</style>
