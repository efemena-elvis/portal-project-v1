<template>
  <div>
    <OverviewCard />
  </div>
  <Charts />
</template>

<script setup lang="ts">
import OverviewCard from "@/modules/overview/components/aggregator/overview-card.vue";

import TransactionTable from "../../components/transaction-table.vue";
import Charts from "../../components/aggregator/charts.vue";
</script>

<style scoped></style>
