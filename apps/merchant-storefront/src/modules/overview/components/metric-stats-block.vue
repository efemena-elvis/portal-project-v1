<template>
  <div class="metric-content">
    <MetricItem
      metric-style="bg-green-100/30 border-green-200"
      metric-title="Transaction volume"
      metric-value="45"
      metric-percentage-change="+2.5%"
    />
    <MetricItem
      metric-style="bg-blue-100/30 border-blue-200"
      metric-title="Total Sales"
      metric-value="ZMW 1,250"
      metric-percentage-change="-1.2%"
    />
    <MetricItem
      metric-style="bg-yellow-100/30 border-yellow-200"
      metric-title="New Orders"
      metric-value="32"
      metric-percentage-change="+5.0%"
    />
    <MetricItem
      metric-style="bg-red-100/20 border-red-200"
      metric-title="Completed Orders"
      metric-value="5"
      metric-percentage-change="+0.5%"
    />
    <MetricItem
      metric-style="bg-purple-100/30 border-purple-200"
      metric-title="Active Customers"
      metric-value="24"
      metric-percentage-change="+2.0%"
    />
    <MetricItem
      metric-style="bg-brown-100/20 border-brown-200"
      metric-title="Total Customers"
      metric-value="54"
      metric-percentage-change="+0.5%"
    />
  </div>
</template>

<script setup lang="ts">
import { MetricItem } from "@/modules/overview/components";

const props = defineProps({
  metrics: {
    default: () => [],
  },
});
</script>

<style lang="scss" scoped>
.metric-content {
  @apply grid grid-cols-2 gap-5;
}
</style>
