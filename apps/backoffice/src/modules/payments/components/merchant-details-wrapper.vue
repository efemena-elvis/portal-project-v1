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
        <div class="business-label-row">
          <p>Business name</p>
          <span v-if="businessStatus" :class="['chip', businessStatus === 'approved' || businessStatus === 'verified' ? 'chip-success' : 'chip-warning']">{{ businessStatus.charAt(0).toUpperCase() + businessStatus.slice(1) }}</span>
        </div>
        <div class="business-title-row">
          <h1>{{ businessName }}</h1>
          <span class="chip chip-type">{{
            entityType || businessType
          }}</span>
          <span v-if="countryName" class="chip chip-info">{{ countryName }}</span>
        </div>
      </div>

      <slot name="summaryExtra" />
    </section>

    <!-- <MerchantPayoutCard
      v-if="showPayoutRequest"
      :payoutRequest="payoutRequest"
      :selectedCurrency="selectedCurrency"
      @payoutActionSelected="
        (action: any) => $emit('payoutActionSelected', action)
      "
    /> -->

    <section class="metrics-card">
      <div class="metrics-toolbar">
        <label class="currency-select">
          <select v-model="selectedCurrency">
            <option
              v-for="currency in currencyOptions"
              :key="currency"
              :value="currency"
            >
              {{ currency }} ({{ getCurrencySign(currency) }})
            </option>
          </select>
          <span class="icon icon-caret-down"></span>
        </label>
      </div>

      <div class="metrics-content">
        <MerchantMetricsGrid
          :source="metricsSource"
          :selectedCurrency="selectedCurrency"
          :wallets="wallets"
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
import { useString } from "@packages/hooks";
import { getCountryByCode, countryCurrencies } from "@packages/constants";
import MerchantAdminActions from "./merchant-admin-actions.vue";
import MerchantDonut from "./merchant-donut.vue";
import MerchantPayoutCard from "./merchant-payout-card.vue";
import MerchantMetricsGrid from "./merchant-metrics-grid.vue";

type MerchantAction = "reset-password" | "login" | "reset-mfa" | "delete";
type PayoutAction = "approve" | "reject";

const props = defineProps<{
  merchantId: string;
  merchantDetails?: Record<string, any> | null;
  businessName?: string;
  businessStatus?: string;
  showAdminActions?: boolean;
  showPayoutRequest?: boolean;
  showMetrics?: boolean;
  entityType?: string;
  overviewData?: Record<string, any> | null;
}>();

defineEmits<{
  actionSelected: [action: MerchantAction];
  payoutActionSelected: [action: PayoutAction];
}>();

const router = useRouter();
const { formatNumber } = useString();

const selectedCurrency = ref("NGN");

const getCurrencySign = (code: string) =>
  countryCurrencies.find((c) => c.currency.short === code)?.currency.sign ||
  code;

const wallets = computed<any[]>(() => props.overviewData?.wallets || []);

const currencyOptions = computed<string[]>(() =>
  wallets.value.length
    ? [...new Set(wallets.value.map((w: any) => w.currency))]
    : ["NGN", "GHS", "TZS", "ZMW", "USD"],
);

const metricsSource = computed(() => {
  const data = props.overviewData;
  if (!data) return props.merchantDetails?.metrics || props.merchantDetails?.summary || {};

  return {
    available_balance: data.available_balance,
    total_transactions: data.total_transaction_amount,
    total_payout: data.total_payout_amount,
    refunds: data.total_refund_amount,
  };
});

const transactionStats = computed(() => {
  const data = props.overviewData;
  if (!data) {
    return [
      { title: "Total Collections", value: 0 },
      { title: "Completed", value: 0 },
      { title: "Pending", value: 0 },
      { title: "Failed", value: 0 },
    ];
  }

  return [
    { title: "Total Collections", value: 100 },
    { title: "Completed", value: data.transaction_successful_percentage || 0 },
    { title: "Pending", value: data.transaction_pending_percentage || 0 },
    { title: "Failed", value: data.transaction_failed_percentage || 0 },
  ];
});

watch(
  () => wallets.value,
  (newWallets) => {
    if (newWallets.length && newWallets[0]?.currency) {
      selectedCurrency.value = newWallets[0].currency;
    }
  },
  { immediate: true },
);

const detail = computed(() => props.merchantDetails || {});
const payoutRequest = computed(
  () => detail.value.payout_request || detail.value.payoutRequest || {},
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
const countryName = computed(() => {
  const fromMerchant =
    detail.value.country?.name ||
    detail.value.country_name ||
    detail.value.country;
  if (fromMerchant) return fromMerchant;

  const code = props.overviewData?.profile?.business?.country_code;
  if (!code) return "";
  return getCountryByCode(code)?.country || code;
});
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

.business-label-row {
  @apply flex items-center gap-3;

  > p {
    @apply text-sm font-medium text-grey-600;
  }

  .chip {
    @apply px-3 py-0.5 text-xs;
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

.chip-type {
 @apply bg-purple-50 text-purple-700;
}

.chip-warning {
  @apply bg-yellow-50 text-yellow-700;
}

.chip-info {
  @apply bg-blue-50 text-blue-600;
}

.chip-success {
  @apply bg-green-50 text-green-600;
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
