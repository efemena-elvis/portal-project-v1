<template>
  <div class="metric-content">
    <MetricItem
      metric-style="bg-green-100/30 border-green-100"
      metric-title="Transaction volume"
      metric-value="45"
      metric-percentage-change="+2.5%"
    />
    <MetricItem
      metric-style="bg-blue-100/30 border-blue-100"
      metric-title="Total Sales"
      metric-value="ZMW 1,250"
      metric-percentage-change="-1.2%"
    />
    <MetricItem
      metric-style="bg-yellow-100/30 border-yellow-100"
      metric-title="New Customers"
      metric-value="30"
      metric-percentage-change="+5.0%"
    />
    <MetricItem
      metric-style="bg-red-100/20 border-red-100"
      metric-title="Completed Orders"
      metric-value="5"
      metric-percentage-change="+0.5%"
    />
  </div>
</template>

<script setup lang="ts">
import { MetricItem } from "@/modules/overview/components";
</script>

<style lang="scss" scoped>
.metric-content {
  @apply grid grid-cols-2 gap-4;
}
</style>
