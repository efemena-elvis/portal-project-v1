<template>
  <PageContentWrapper
    description="Showing transactions and analytics across different markets"
  >
    <template v-slot:pageOptions>
      <div class="button-row">
        <!-- <div>
          <DatePicker
            :activePeriod="selectedDateRange"
            @onFilterSelected="handleDateRangeSelection"
            filterSize="lg"
          />
        </div> -->
        <div class="w-[200px]">
          <SelectFieldInput
            :inputValue="selectedPeriod"
            :selectData="periods"
            isRequired
            @onSelectionChange="selectedPeriod = $event"
          />
        </div>
        <div v-if="selectedPaymentMethod !== 'card'" class="w-[200px]">
          <CountrySelector
            v-model="selectedCountry"
            placeholder="Select country"
          />
        </div>

        <div class="w-[200px]">
          <SelectFieldInput
            :inputValue="selectedPaymentMethod"
            :selectData="paymentMethods"
            isRequired
            @onSelectionChange="selectedPaymentMethod = $event"
          />
        </div>
      </div>
    </template>

    <template v-slot:pageContent>
      <div
        class="statistics-row"
        :class="statisticsCards.length <= 2 ? 'grid-cols-2' : 'grid-cols-4'"
      >
        <StatisticsCard
          v-for="card in statisticsCards"
          :key="card.label"
          :label="card.label"
          :value="card.value"
        />
      </div>

      <div class="charts-container">
        <div class="chart-card w-[70%]">
          <div class="chart-header">
            <div>
              <h3 class="chart-title">Transaction statistics</h3>
            </div>
            <span class="chart-period">{{ selectedPeriod }}</span>
          </div>
          <StackedBarChart :data="transactionStatisticsData" />
        </div>
        <div class="chart-card chart-card-analysis w-[30%]">
          <div class="chart-header">
            <div>
              <h3 class="chart-title">Transaction analysis</h3>
            </div>
            <span class="chart-period">{{ selectedPeriod }}</span>
          </div>
          <div class="donut-wrapper">
            <DoughnutChart
              :data="transactionAnalysisData"
              :backgroundColors="chartColors"
            />
            <div class="donut-total-card">
              <span class="donut-total-label">Total transactions</span>
              <span class="donut-total-value">100%</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </PageContentWrapper>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import {
  PageContentWrapper,
  // DatePicker,
  StackedBarChart,
  DoughnutChart,
  SelectFieldInput,
} from "@packages/uikit";
import { StatisticsCard, CountrySelector } from "@/modules/overview/components";

const selectedCountry = ref("");
// const selectedDateRange = ref<[Date, Date] | null>(null);
const selectedPeriod = ref("This month");
const selectedPaymentMethod = ref("mobilemoney");
const periods = [
  { name: "This month", value: "This month" },
  { name: "This year", value: "This year" },
  { name: "Yesterday", value: "Yesterday" },
];
const paymentMethods = [
  { name: "Mobile Money", value: "mobilemoney" },
  { name: "Card", value: "card" },
];
interface StatisticsCardData {
  label: string;
  value: string;
}

const statisticsCards = computed(() => {
  const cards: StatisticsCardData[] = [
    { label: "Total Volume Processed", value: "₦1.2M" },
    { label: "Collection", value: "₦10.04B" },
    { label: "Payout", value: "₦2.8B" },
    { label: "Revenue", value: "₦1.2M" },
  ]

  if (selectedPaymentMethod.value === "card") {
    return cards.filter(
      (card) =>
        card.label !== "Payout" &&
        card.label !== "Total Volume Processed",
    )
  }

  return cards
})

const transactionStatisticsData = ref([
  { month: "Jan", successful: 300, failed: 50 },
  { month: "Feb", successful: 650, failed: 120 },
  { month: "Mar", successful: 900, failed: 180 },
  { month: "Apr", successful: 650, failed: 220 },
  { month: "May", successful: 650, failed: 130 },
  { month: "Jun", successful: 750, failed: 140 },
  { month: "Jul", successful: 800, failed: 160 },
  { month: "Aug", successful: 680, failed: 150 },
  { month: "Sep", successful: 820, failed: 170 },
  { month: "Oct", successful: 700, failed: 140 },
  { month: "Nov", successful: 750, failed: 130 },
  { month: "Dec", successful: 820, failed: 160 },
]);

const transactionAnalysisData = ref([
  { country: "Successful", amount: 75 },
  { country: "Failed", amount: 15 },
  { country: "Pending", amount: 10 },
]);

const chartColors = ["#3ab75d", "#d6341b", "#eea41a"];
</script>

<style lang="scss" scoped>
.button-row {
  @apply flex flex-row gap-4 mb-6 justify-end;
  .btn-sm {
    @apply py-0.5 px-5 h-[46px] gap-x-1 font-semibold sm:mt-12;
  }
}

.statistics-row {
  @apply grid sm:grid-cols-1 grid-cols-4 gap-4 mb-8;
}

.filters-section {
  @apply grid sm:grid-cols-1 grid-cols-3 gap-4 mb-8 items-end;

  .filter-group-compact {
    @apply flex flex-wrap gap-2 items-center;
  }

  .period-btn {
    @apply px-4 py-2 text-sm font-medium text-grey-600 bg-white border border-grey-200 rounded-lg transition-all hover:border-teal-400;
  }

  .period-btn-active {
    @apply bg-teal-50 text-teal-600 border-teal-400;
  }
}

.charts-container {
  @apply flex sm:flex-col  gap-6;
}

.chart-card {
  @apply bg-white rounded-xl border border-grey-100 p-6 shadow-sm;
}

.chart-header {
  @apply flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-6;
}

.chart-title {
  @apply text-lg font-semibold text-grey-900;
}

.chart-subtitle {
  @apply text-sm text-grey-500;
}

.chart-period {
  @apply text-sm text-grey-500;
}

.chart-card-analysis {
  .donut-wrapper {
    @apply relative z-0;
  }

  .donut-total-card {
    @apply absolute left-1/2 top-[46.3%] w-[192px] h-[192px]  -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F1F7F6] flex flex-col items-center justify-center py-4 -z-10;
  }

  .donut-total-label {
    @apply text-sm text-grey-500;
  }

  .donut-total-value {
    @apply text-xl font-semibold text-grey-900;
  }
}
</style>
