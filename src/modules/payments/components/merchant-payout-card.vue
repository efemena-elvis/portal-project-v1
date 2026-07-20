<template>
  <section class="payout-card">
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
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useDate, useString } from "@packages/hooks";

const props = defineProps<{
  payoutRequest: Record<string, any>;
  selectedCurrency: string;
}>();

defineEmits<{
  payoutActionSelected: [action: "approve" | "reject"];
}>();

const { formatNumber } = useString();

const payoutDate = computed(() => {
  const rawDate = props.payoutRequest.date || props.payoutRequest.created_at;
  if (!rawDate) return "12th April, 2022";
  const { d3, m3, y1 } = useDate.formatDate(rawDate).getAll();
  return `${d3} ${m3}, ${y1}`;
});

const payoutAmount = computed(() => {
  const amount =
    props.payoutRequest.amount || props.payoutRequest.amount_requested;
  const currency = props.payoutRequest.currency || props.selectedCurrency;
  if (!amount) return "$30,000";
  return `${currency} ${formatNumber(amount)}`;
});

const payoutSortCode = computed(
  () =>
    props.payoutRequest.sort_code || props.payoutRequest.sortCode || "014004",
);

const payoutAccountNumber = computed(
  () =>
    props.payoutRequest.account_number ||
    props.payoutRequest.accountNumber ||
    "012703765",
);
</script>

<style scoped lang="scss">
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
</style>
