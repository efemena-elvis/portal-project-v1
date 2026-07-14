<template>
  <div class="status-chart">
    <div class="donut" :style="donutStyle"></div>
    <div class="status-legend">
      <div v-for="item in statusBreakdown" :key="item.label" class="legend-row">
        <span :class="item.className"></span>
        <p>{{ item.label }} - {{ item.value }}%</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  stats: { title: string; value: number }[];
}>();

const statusBreakdown = computed(() => {
  const total =
    props.stats.find((s) => s.title === "Total Transactions")?.value || 0;
  const completed =
    props.stats.find((s) => s.title === "Completed")?.value || 0;
  const pending = props.stats.find((s) => s.title === "Pending")?.value || 0;
  const failed = props.stats.find((s) => s.title === "Failed")?.value || 0;

  const c = total ? Math.round((completed / total) * 100) : 0;
  const p = total ? Math.round((pending / total) * 100) : 0;
  const f = total ? Math.round((failed / total) * 100) : 0;

  return [
    {
      label: "Successful",
      value: c,
      className: "legend-dot legend-dot--success",
    },
    { label: "Pending", value: p, className: "legend-dot legend-dot--pending" },
    { label: "Failed", value: f, className: "legend-dot legend-dot--failed" },
  ];
});

const donutStyle = computed(() => {
  const [success, pending, failed] = statusBreakdown.value;
  const successEnd = success.value;
  const pendingEnd = success.value + pending.value;
  const failedEnd = pendingEnd + failed.value;

  return {
    background: `conic-gradient(#34bd63 0 ${successEnd}%, #f5b740 ${successEnd}% ${pendingEnd}%, #df7391 ${pendingEnd}% ${failedEnd}%, #e9f1ef ${failedEnd}% 100%)`,
  };
});
</script>

<style scoped lang="scss">
.status-chart {
  @apply flex min-h-[190px] items-center gap-20 justify-center rounded-lg bg-grey-50 p-6 md:gap-8 sm:flex-col;
}

.donut {
  @apply relative size-36 shrink-0 rounded-full;

  &::after {
    @apply absolute left-1/2 top-1/2 size-[82px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-50 content-[''];
  }
}

.status-legend {
  @apply flex flex-col gap-6;
}

.legend-row {
  @apply flex items-center gap-4 text-sm font-medium text-grey-900;
}

.legend-dot {
  @apply size-5 rounded-full;
}

.legend-dot--success {
  @apply bg-green-500;
}

.legend-dot--pending {
  @apply bg-yellow-500;
}

.legend-dot--failed {
  @apply bg-red-300;
}
</style>
