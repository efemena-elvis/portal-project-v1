<!-- eslint-disable vue/multi-word-component-names, vue/valid-define-props, vue/valid-define-emits -->
<template>
  <ModalDialog
    place_side
    :modal_style="{
      shape: 'rounded-none',
      size: 'modal-md modal-h-full',
      background: 'bg-white',
    }"
    @closeModal="$emit('closeTriggered')"
  >
    <template #modal-cover-header>
      <div class="detail-modal-header">
        <h2>Transaction #{{ transaction?.id || "-" }}</h2>
        <span
          v-if="transaction?.status"
          class="status-badge"
          :class="statusClass"
        >
          {{ transaction.status }}
        </span>
      </div>
    </template>

    <template #modal-cover-body>
      <div class="detail-modal-body">
        <div class="section-block">
          <h3 class="section-title">Transaction</h3>
          <div class="detail-list">
          
            <DetailRow label="Reference" :value="transaction?.reference" />
           <DetailRow label="Provider Reference" :value="transaction?.provider_reference" />
            <DetailRow
              label="Type"
              :value="
                capitalizeFirstLetter(
                  transaction?.type?.replace(/_/g, ' ') || '',
                )
              "
            />
            <DetailRow label="Method" :value="transaction?.method" />
    
       
            <DetailRow label="Environment" :value="transaction?.environment" />
          </div>
        </div>

        <div class="section-block">
          <h3 class="section-title">Amount</h3>
          <div class="detail-list">
            <DetailRow label="Amount" :value="displayAmount" />
            <DetailRow label="Fee" :value="displayFee" />
            <DetailRow label="Net Amount" :value="displayNetAmount" />
            <DetailRow label="Provider Amount" :value="displayProviderAmount" />
            <DetailRow label="Fee Payer" :value="transaction?.fee_payer" />
            <DetailRow label="Currency" :value="transaction?.currency" />
          </div>
        </div>

        <div class="section-block">
          <h3 class="section-title">Customer</h3>
          <div class="detail-list">
            <DetailRow label="Name" :value="customerName" />
            <DetailRow label="Email" :value="transaction?.email" />
            <DetailRow label="Phone" :value="transaction?.phone" />
            <DetailRow
              label="Account Number"
              :value="transaction?.account_number"
            />
          </div>
        </div>

        <div class="section-block">
          <h3 class="section-title">Metadata</h3>
          <div class="detail-list">
            <DetailRow
              label="Webhook Sent"
              :value="transaction?.webhook_sent ? 'Yes' : 'No'"
            />
          </div>
        </div>

        <div class="section-block">
          <h3 class="section-title">Timeline</h3>
          <div class="detail-list">
            <DetailRow
              label="Created At"
              :value="formatDateTime(transaction?.created_at)"
            />
            <DetailRow
              label="Updated At"
              :value="formatDateTime(transaction?.updated_at)"
            />
            <DetailRow
              label="Completed At"
              :value="formatDateTime(transaction?.completed_at)"
            />
          </div>
        </div>

        <div v-if="hasNotes" class="section-block">
          <h3 class="section-title">Notes</h3>
          <div class="detail-list">
            <DetailRow label="Narration" :value="transaction?.narration" />
            <DetailRow
              v-if="isFailed"
              label="Failure Reason"
              :value="transaction?.failure_reason || transaction?.status"
            />
          </div>
        </div>
      </div>
    </template>
  </ModalDialog>
</template>

<script setup lang="ts">
/* eslint-disable no-undef, vue/valid-define-props, vue/valid-define-emits */
import { computed } from "vue";
import { ModalDialog } from "@packages/uikit";
import { useDate, useString } from "@packages/hooks";
import DetailRow from "./detail-row.vue";

const props = defineProps<{
  transaction: Record<string, any> | null;
}>();

defineEmits<{
  closeTriggered: [];
}>();

const { formatNumber, capitalizeFirstLetter } = useString();

const displayAmount = computed(() => {
  if (!props.transaction?.amount && props.transaction?.amount !== 0) return "-";
  return `${props.transaction.currency || ""} ${formatNumber(props.transaction.amount)}`;
});

const displayFee = computed(() => {
  if (!props.transaction?.fee && props.transaction?.fee !== 0) return "-";
  return `${props.transaction.currency || ""} ${formatNumber(props.transaction.fee)}`;
});

const displayNetAmount = computed(() => {
  if (!props.transaction?.net_amount && props.transaction?.net_amount !== 0)
    return "-";
  return `${props.transaction.currency || ""} ${formatNumber(props.transaction.net_amount)}`;
});

const displayProviderAmount = computed(() => {
  if (
    !props.transaction?.provider_amount &&
    props.transaction?.provider_amount !== 0
  )
    return "-";
  return `${props.transaction.currency || ""} ${formatNumber(props.transaction.provider_amount)}`;
});

const customerName = computed(() => {
  const transactionData = props.transaction;
  if (!transactionData) return "-";
  const first = transactionData.first_name?.toString().trim() || "";
  const last = transactionData.last_name?.toString().trim() || "";
  if (first || last) return `${first} ${last}`.trim();
  const account = transactionData.account_number?.toString().trim();
  if (account) return account;
  return transactionData.email || "-";
});

const isFailed = computed(() => {
  const status = props.transaction?.status?.toLowerCase() || "";
  return status.includes("failed");
});

const hasNotes = computed(() => {
  return !!props.transaction?.narration || isFailed.value;
});

const formatDateTime = (date?: string) => {
  if (!date) return "-";
  const { d3, m3, y1 } = useDate.formatDate(date).getAll();
  const time = useDate.formatTime(date);
  return `${d3} ${m3}, ${y1} ${time}`;
};

const statusClass = computed(() => {
  const status =
    props.transaction?.status?.toLowerCase().replace(/_/g, " ") || "";
  if (status.includes("completed")) {
    return "status-success";
  }
  if (status.includes("failed")) {
    return "status-danger";
  }
  if (status.includes("pending")) {
    return "status-warning";
  }
  return "status-neutral";
});
</script>

<style scoped lang="scss">
.detail-modal-header {
  @apply px-8 pt-8 sm:px-5 sm:pt-6 flex items-center justify-between gap-4;

  h2 {
    @apply text-[28px] font-bold text-grey-900 sm:text-2xl;
  }
}

.detail-modal-body {
  @apply flex flex-col gap-8 px-8 pt-8 pb-12 sm:gap-6 sm:px-5 sm:pt-6;
}

.section-block {
  @apply flex flex-col gap-4;
}

.section-title {
  @apply text-[17px] font-bold text-grey-900;
}

.detail-list {
  @apply flex flex-col border border-grey-100 rounded-lg overflow-hidden;
}

.status-badge {
  @apply rounded-full border px-4 py-2 text-sm font-semibold capitalize;
}

.status-success {
  @apply border-green-100 bg-green-50 text-green-600;
}

.status-warning {
  @apply border-yellow-100 bg-yellow-50 text-yellow-600;
}

.status-danger {
  @apply border-red-100 bg-red-50 text-red-600;
}

.status-neutral {
  @apply border-grey-100 bg-grey-50 text-grey-600;
}
</style>
