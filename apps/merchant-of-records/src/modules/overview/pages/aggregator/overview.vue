<template>
  <div>
    <div class="flex justify-between items-center">
      <h1 class="font-semibold text-2xl">Overview</h1>
      <div class="button-row">
        <router-link
          to="#"
          class="btn btn-primary btn-sm hover:text-white !h-[36px]"
        >
          <div class="text-xl font-semibold"></div>
          Add Merchants
        </router-link>
      </div>
    </div>
    <OverviewCard />
  </div>
  <Charts/>
    <TransactionTable/>
</template>

<script setup lang="ts">
import OverviewCard from "@/modules/overview/components/aggregator/overview-card.vue";

import TransactionTable from "../../components/transaction-table.vue";
import Charts from "../../components/aggregator/charts.vue";
</script>

<style scoped></style>
