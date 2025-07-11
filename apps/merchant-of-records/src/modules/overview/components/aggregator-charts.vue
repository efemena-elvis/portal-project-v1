<template>
  <div class="aggregator-charts">
    <div class="bg-grey-10 p-8 rounded-xl w-[60%] sm:w-full lg:w-1/2">
      <p class="text-xl font-semibold mb-2">Transactions</p>

      <LineChart
        :data="[successData, failedData]"
        :dataLabels="['Successful', 'Failed']"
        :labels="labels"
        class="border-none sm:h-auto h-80"
      />
    </div>

    <div class="bg-grey-10 p-8 rounded-xl w-[40%] lg:w-1/2 sm:w-full">
      <p class="text-xl font-semibold mb-2">Payouts</p>

      <BarChart />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BarChart, LineChart } from "@packages/uikit";

const labels = ref<string[]>([
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]);

const successData = [10, 20, 30, 20, 15, 10, 10, 5, 0];
const failedData = [5, 10, 15, 10, 20, 25, 20, 15, 10, 5];
</script>

<style lang="scss" scoped>
.aggregator-charts {
  @apply flex mb-8 gap-8 sm:flex-col h-auto;
}
</style>
