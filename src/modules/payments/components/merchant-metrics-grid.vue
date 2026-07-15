<template>
  <div class="metric-grid">
    <article v-for="metric in metrics" :key="metric.label" class="metric-tile">
      <p>{{ metric.label }}</p>
      <strong>{{ metric.value }}</strong>
    </article>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useString } from "@packages/hooks";

const props = defineProps<{
  source: Record<string, any>;
  selectedCurrency: string;
}>();

const currencySymbols: Record<string, string> = {
  NGN: "\u20A6",
  GHS: "GHS",
  TZS: "TSh",
  ZMW: "ZK",
  USD: "$",
};

const { formatNumber } = useString();

const formatMetric = (value: unknown, fallback: string) => {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value === "number")
    return `${currencySymbols[props.selectedCurrency] || ""}${formatNumber(value)}`;
  return `${value}`;
};

const metrics = computed(() => [
  {
    label: "Available Balance",
    value: formatMetric(props.source.available_balance, "$0"),
  },
  {
    label: "Total Transactions",
    value: formatMetric(props.source.total_transactions, "$0"),
  },
  {
    label: "Total Payout",
    value: formatMetric(props.source.total_payout, "$0"),
  },
  {
    label: "Refunds",
    value: formatMetric(props.source.refunds, "$0"),
  },
]);
</script>

<style scoped lang="scss">
.metric-grid {
  @apply grid grid-cols-2 gap-5 sm:grid-cols-1;
}

.metric-tile {
  @apply min-h-[84px] rounded-lg bg-grey-50 p-6;

  p {
    @apply mb-3 text-xs font-semibold text-grey-600;
  }

  strong {
    @apply text-2xl font-bold text-grey-900;
  }
}
</style>
