<!-- eslint-disable vue/valid-define-props, vue/valid-define-emits -->
<template>
  <main class="merchant-details">
    <header class="page-header">
      <button class="back-button" type="button" @click="handleGoBack">
        <span class="icon icon-arrow-left"></span>
        Back
      </button>

      <div v-if="showAdminActions" class="admin-actions">
        <button
          class="outline-action outline-action--success"
          type="button"
          @click="$emit('actionSelected', 'reset-password')"
        >
          Reset account password
        </button>
        <button
          class="outline-action outline-action--success"
          type="button"
          @click="$emit('actionSelected', 'login')"
        >
          Login to account
        </button>
        <button
          class="outline-action outline-action--danger"
          type="button"
          @click="$emit('actionSelected', 'delete')"
        >
          Deactivate merchant's account
        </button>
      </div>
    </header>

    <section class="summary-card">
      <div class="business-logo">
        <img v-if="businessLogo" :src="businessLogo" :alt="businessName" />
        <span v-else>{{ businessInitials }}</span>
      </div>

      <div class="business-copy">
        <p>Business name</p>
        <div class="business-title-row">
          <h1>{{ businessName }}</h1>
          <span class="chip chip-warning">{{
            entityType || businessType
          }}</span>
          <span class="chip chip-info">{{ countryName }}</span>
        </div>
      </div>

      <slot name="summaryExtra" />
    </section>

    <section v-if="showPayoutRequest" class="payout-card">
      <h2>Payout request</h2>

      <div class="payout-grid">
        <div>
          <p>Date</p>
          <strong>{{ payoutDate }}</strong>
        </div>
        <div>
          <p>Amount</p>
          <strong>{{ payoutAmount }}</strong>
        </div>
        <div>
          <p>Sort code</p>
          <strong>{{ payoutSortCode }}</strong>
        </div>
        <div>
          <p>Account number</p>
          <strong>{{ payoutAccountNumber }}</strong>
        </div>
      </div>

      <div class="payout-actions">
        <button
          class="solid-action solid-action--danger"
          type="button"
          @click="$emit('payoutActionSelected', 'reject')"
        >
          Reject
        </button>
        <button
          class="solid-action solid-action--success"
          type="button"
          @click="$emit('payoutActionSelected', 'approve')"
        >
          Approve
        </button>
      </div>
    </section>

    <section v-if="showMetrics" class="metrics-card">
      <div class="metrics-toolbar">
        <label class="currency-select">
          <select v-model="selectedCurrency">
            <option
              v-for="currency in currencyOptions"
              :key="currency"
              :value="currency"
            >
              {{ currency }} ({{ currencySymbols[currency] || currency }})
            </option>
          </select>
          <span class="icon icon-caret-down"></span>
        </label>

        <DatePicker
          filterSize="lg"
          :activePeriod="activePeriod"
          @onFilterSelected="processFilterSelection"
        />
      </div>

      <div class="metrics-content">
        <div class="metric-grid">
          <article
            v-for="metric in metrics"
            :key="metric.label"
            class="metric-tile"
          >
            <p>{{ metric.label }}</p>
            <strong>{{ metric.value }}</strong>
          </article>
        </div>

        <div class="status-chart">
          <div class="donut" :style="donutStyle"></div>
          <div class="status-legend">
            <div
              v-for="item in statusBreakdown"
              :key="item.label"
              class="legend-row"
            >
              <span :class="item.className"></span>
              <p>{{ item.label }} - {{ item.value }}%</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <slot />
  </main>
</template>

<script setup lang="ts">
/* eslint-disable vue/valid-define-props, vue/valid-define-emits */
import { computed, defineEmits, defineProps, ref, withDefaults } from "vue";
import { useRouter } from "vue-router";
import { DatePicker } from "@packages/uikit";
import { useDate, useString } from "@packages/hooks";

type MerchantAction = "reset-password" | "login" | "delete";
type PayoutAction = "approve" | "reject";

const props = withDefaults(
  defineProps<{
    merchantId: string;
    merchantDetails?: Record<string, any> | null;
    businessName?: string;
    businessStatus?: string;
    showAdminActions?: boolean;
    showPayoutRequest?: boolean;
    showMetrics?: boolean;
    entityType?: string;
  }>(),
  {
    merchantDetails: null,
    businessName: "Tech-village Inc",
    businessStatus: "Verified",
    showAdminActions: true,
    showPayoutRequest: true,
    showMetrics: true,
    entityType: "",
  },
);

defineEmits<{
  actionSelected: [action: MerchantAction];
  payoutActionSelected: [action: PayoutAction];
}>();

const router = useRouter();
const { formatNumber } = useString();

const activePeriod = ref<[Date, Date] | null>(null);
const selectedCurrency = ref("NGN");
const currencyOptions = ["NGN", "GHS", "TZS", "ZMW", "USD"];
const currencySymbols: Record<string, string> = {
  NGN: "₦",
  GHS: "GHS",
  TZS: "TSh",
  ZMW: "ZK",
  USD: "$",
};

const detail = computed(() => props.merchantDetails || {});
const payoutRequest = computed(
  () => detail.value.payout_request || detail.value.payoutRequest || {},
);
const metricsSource = computed(
  () => detail.value.metrics || detail.value.summary || {},
);

const businessName = computed(
  () =>
    detail.value.business_name ||
    detail.value.businessName ||
    detail.value.name ||
    props.businessName,
);
const businessType = computed(
  () => detail.value.type || detail.value.business_type || "Merchant",
);
const countryName = computed(
  () =>
    detail.value.country?.name ||
    detail.value.country_name ||
    detail.value.country ||
    "Tanzania",
);
const businessLogo = computed(
  () =>
    detail.value.logo ||
    detail.value.business_logo ||
    detail.value.avatar ||
    "",
);
const businessInitials = computed(() =>
  businessName.value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part: string) => part[0])
    .join("")
    .toUpperCase(),
);

const payoutDate = computed(() => {
  const rawDate = payoutRequest.value.date || payoutRequest.value.created_at;
  if (!rawDate) return "12th April, 2022";

  const { d3, m3, y1 } = useDate.formatDate(rawDate).getAll();
  return `${d3} ${m3}, ${y1}`;
});

const payoutAmount = computed(() => {
  const amount =
    payoutRequest.value.amount || payoutRequest.value.amount_requested;
  const currency = payoutRequest.value.currency || selectedCurrency.value;
  if (!amount) return "$30,000";

  return `${currency} ${formatNumber(amount)}`;
});
const payoutSortCode = computed(
  () =>
    payoutRequest.value.sort_code || payoutRequest.value.sortCode || "014004",
);
const payoutAccountNumber = computed(
  () =>
    payoutRequest.value.account_number ||
    payoutRequest.value.accountNumber ||
    "012703765",
);

const formatMetric = (value: unknown, fallback: string) => {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value === "number")
    return `${currencySymbols[selectedCurrency.value] || ""}${formatNumber(value)}`;
  return `${value}`;
};

const metrics = computed(() => [
  {
    label: "Available Balance",
    value: formatMetric(metricsSource.value.available_balance, "$52,000"),
  },
  {
    label: "Total Transactions",
    value: formatMetric(metricsSource.value.total_transactions, "Z52,000"),
  },
  {
    label: "Total Payout",
    value: formatMetric(metricsSource.value.total_payout, "Z52,000"),
  },
  {
    label: "Refunds",
    value: formatMetric(metricsSource.value.refunds, "Z52,000"),
  },
]);

const statusBreakdown = computed(() => {
  const source = metricsSource.value.status_breakdown || {};
  return [
    {
      label: "Successful",
      value: Number(source.successful ?? source.success ?? 68),
      className: "legend-dot legend-dot--success",
    },
    {
      label: "Pending",
      value: Number(source.pending ?? 12),
      className: "legend-dot legend-dot--pending",
    },
    {
      label: "Failed",
      value: Number(source.failed ?? 20),
      className: "legend-dot legend-dot--failed",
    },
  ];
});

const donutStyle = computed(() => {
  const success = statusBreakdown.value[0].value;
  const pending = statusBreakdown.value[1].value;
  const failed = statusBreakdown.value[2].value;
  const successEnd = success;
  const pendingEnd = success + pending;

  return {
    background: `conic-gradient(#34bd63 0 ${successEnd}%, #f5b740 ${successEnd}% ${pendingEnd}%, #df7391 ${pendingEnd}% ${pendingEnd + failed}%, #e9f1ef ${pendingEnd + failed}% 100%)`,
  };
});

const processFilterSelection = (
  selectedRange: [Date | string, Date | string] | null,
) => {
  if (selectedRange && selectedRange.length === 2) {
    activePeriod.value = [
      new Date(selectedRange[0]),
      new Date(selectedRange[1]),
    ];
    return;
  }

  activePeriod.value = null;
};

const handleGoBack = () => {
  router.back();
};
</script>

<style scoped lang="scss">
.merchant-details {
  @apply flex w-full flex-col gap-6 pt-8 pb-10 text-grey-900;
}

.page-header {
  @apply flex items-center justify-between gap-4 md:flex-col md:items-start;
}

.back-button {
  @apply inline-flex h-10 items-center gap-2 rounded-lg border border-grey-700 bg-white px-4 text-sm font-semibold text-grey-900 transition hover:border-teal-800 hover:text-teal-800;
}

.admin-actions {
  @apply flex flex-wrap items-center justify-end gap-5 md:w-full md:justify-start;
}

.outline-action {
  @apply h-10 rounded-lg border bg-white px-6 text-sm font-bold transition;
}

.outline-action--success {
  @apply border-green-500 text-green-500 hover:bg-green-50;
}

.outline-action--danger {
  @apply border-red-500 text-red-500 hover:bg-pink-50;
}

.summary-card {
  @apply flex items-center gap-6 rounded-[12px] bg-white p-7 sm:flex-col sm:items-start sm:p-5;
}

.business-logo {
  @apply flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-grey-100 bg-teal-50 text-base font-bold text-teal-800;

  img {
    @apply h-full w-full object-cover;
  }
}

.business-copy {
  @apply flex flex-col gap-2;

  > p {
    @apply text-sm font-medium text-grey-600;
  }
}

.business-title-row {
  @apply flex flex-wrap items-center gap-4;

  h1 {
    @apply text-2xl font-bold text-teal-800 sm:text-xl;
  }
}

.chip {
  @apply rounded-full px-5 py-2 text-sm font-semibold;
}

.chip-warning {
  @apply bg-yellow-50 text-yellow-700;
}

.chip-info {
  @apply bg-blue-50 text-blue-600;
}

.payout-card {
  @apply rounded-xl border border-yellow-200 bg-yellow-200/20 p-7;

  h2 {
    @apply mb-5 text-base font-bold text-grey-900;
  }
}

.payout-grid {
  @apply grid grid-cols-4 gap-6 md:grid-cols-2 sm:grid-cols-1;

  p {
    @apply mb-2 text-xs font-bold uppercase text-grey-500;
  }

  strong {
    @apply text-sm font-bold text-grey-900;
  }
}

.payout-actions {
  @apply mt-6 flex items-center gap-5;
}

.solid-action {
  @apply h-10 min-w-[120px] rounded-lg px-6 text-sm font-bold text-white transition;
}

.solid-action--danger {
  @apply bg-red-500 hover:bg-red-600;
}

.solid-action--success {
  @apply bg-green-500 hover:bg-green-600;
}

.metrics-card {
  @apply rounded-lg bg-white p-7 sm:p-5;
}

.metrics-toolbar {
  @apply mb-5 flex items-center justify-between gap-4 md:flex-col md:items-start;
}

.currency-select {
  @apply relative inline-flex h-10 min-w-[96px] items-center rounded-lg border border-grey-200 bg-grey-50 text-sm font-bold text-grey-900;

  select {
    @apply h-full w-full appearance-none bg-transparent px-4 pr-9 outline-none;
  }

  .icon {
    @apply pointer-events-none absolute right-3 text-xs text-grey-700;
  }
}

.metrics-content {
  @apply grid grid-cols-[minmax(0,1fr)_minmax(320px,0.95fr)] gap-7 lg:grid-cols-1;
}

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
