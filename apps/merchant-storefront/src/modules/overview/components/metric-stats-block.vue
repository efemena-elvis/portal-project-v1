<template>
  <div class="metric-content">
    <MetricItem
      metric-style="bg-green-100/30 border-green-200"
      metric-title="Transaction Volume"
      :metric-value="metrics?.transaction_volume"
      :metric-percentage-change="metrics?.transaction_volume_change"
    />
    <MetricItem
      metric-style="bg-blue-100/30 border-blue-200"
      metric-title="Total Sales"
      :metric-value="metrics?.total_sales"
      :metric-percentage-change="metrics?.total_sales_change"
    />
    <MetricItem
      metric-style="bg-yellow-100/30 border-yellow-200"
      metric-title="New Orders"
      :metric-value="metrics?.new_orders"
      :metric-percentage-change="metrics?.new_orders_change"
    />
    <MetricItem
      metric-style="bg-red-100/20 border-red-200"
      metric-title="Completed Orders"
      :metric-value="metrics?.completed_orders"
      :metric-percentage-change="metrics?.completed_orders_change"
    />
    <MetricItem
      metric-style="bg-purple-100/30 border-purple-200"
      metric-title="Active Customers"
      :metric-value="metrics?.active_customers"
      :metric-percentage-change="metrics?.active_customers_change"
      />
    <MetricItem
      metric-style="bg-brown-100/20 border-brown-200"
      metric-title="Total Customers"
      :metric-value="metrics?.total_customers"
      :metric-percentage-change="metrics?.total_customers_change"
    />
  </div>
</template>

<script setup lang="ts">
import { MetricItem } from "@/modules/overview/components";
import { watch } from "vue";

const props = defineProps<{
  metrics: Record<string, any>;
}>();

watch(
  () => props.metrics,
  (newMetrics) => {
    
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.metric-content {
  @apply grid grid-cols-2 gap-5 ;
}
</style>
