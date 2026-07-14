<template>
  <main class="merchant-details">
    <header class="page-header">
      <button class="back-button" type="button" @click="handleGoBack">
        <span class="icon icon-arrow-left"></span>
        Back
      </button>

      <MerchantAdminActions
        v-if="showAdminActions"
        @actionSelected="(action: any) => $emit('actionSelected', action)"
      />
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

    <MerchantPayoutCard
      v-if="showPayoutRequest"
      :payoutRequest="payoutRequest"
      :selectedCurrency="selectedCurrency"
      @payoutActionSelected="
        (action: any) => $emit('payoutActionSelected', action)
      "
    />

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
      </div>

      <div class="metrics-content">
        <MerchantMetricsGrid
          :source="metricsSource"
          :selectedCurrency="selectedCurrency"
        />
        <MerchantDonut :stats="transactionStats" />
      </div>
    </section>

    <slot />
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useString, useEvents } from "@packages/hooks";
import { usePaymentStore } from "@/modules/payments/store";
import MerchantAdminActions from "./merchant-admin-actions.vue";
import MerchantDonut from "./merchant-donut.vue";
import MerchantPayoutCard from "./merchant-payout-card.vue";
import MerchantMetricsGrid from "./merchant-metrics-grid.vue";

type MerchantAction = "reset-password" | "login" | "reset-mfa" | "delete";
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
const { processAPIRequest } = useEvents();
const { getTransactions } = usePaymentStore();

const selectedCurrency = ref("NGN");
const currencyOptions = ["NGN", "GHS", "TZS", "ZMW", "USD"];
const currencySymbols: Record<string, string> = {
  NGN: "\u20A6",
  GHS: "GHS",
  TZS: "TSh",
  ZMW: "ZK",
  USD: "$",
};

const isLoadingStats = ref(false);
const transactionStats = ref<{ title: string; value: number }[]>([
  { title: "Total Transactions", value: 0 },
  { title: "Completed", value: 0 },
  { title: "Pending", value: 0 },
  { title: "Failed", value: 0 },
]);

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

const fetchStats = async () => {
  if (!props.merchantId) return;
  isLoadingStats.value = true;

  const base = `?page_size=1&user_id=${props.merchantId}`;
  const call = (filters: string) =>
    processAPIRequest({
      action: getTransactions,
      payload: { filters },
      showAlert: false,
    });

  const [totalRes, completedRes, pendingRes, failedRes] = await Promise.all([
    call(base),
    call(`${base}&status=completed`),
    call(`${base}&status=pending`),
    call(`${base}&status=failed`),
  ]);

  isLoadingStats.value = false;

  const parseTotal = (res: any) => {
    const src = res?.pagination?.[0] || res?.data;
    return src?.total_records || src?.total || 0;
  };

  transactionStats.value = [
    { title: "Total Transactions", value: parseTotal(totalRes) },
    { title: "Completed", value: parseTotal(completedRes) },
    { title: "Pending", value: parseTotal(pendingRes) },
    { title: "Failed", value: parseTotal(failedRes) },
  ];
};

const handleGoBack = () => {
  router.back();
};

watch(
  () => props.merchantId,
  () => {
    fetchStats();
  },
);

onMounted(() => {
  fetchStats();
});
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

:deep(tbody tr td:last-child) {
  text-align: left;
}
</style>
