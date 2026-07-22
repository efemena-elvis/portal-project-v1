<template>
  <ModalDialog
    place_center
    :modal_style="{
      shape: 'rounded-2xl',
      size: 'modal-md',
      background: 'bg-white',
    }"
    @closeModal="$emit('closeTriggered')"
  >
    <template #modal-cover-header>
      <div class="modal-cover-header request-modal-header">
        <h2>{{ title }}</h2>
      </div>
    </template>

    <template #modal-cover-body>
      <div class="modal-cover-body request-modal-body">
        <div class="amount-row">
          <div>
            <p class="label">Amount</p>
            <h3>{{ displayAmount }}</h3>
          </div>

          <span :class="['status-badge', statusClass]">
            {{ request.status }}
          </span>
        </div>

        <div class="detail-list">
          <div class="detail-row">
            <span>Date</span>
            <strong>{{ request.date || "-" }}</strong>
          </div>
          <div class="detail-row">
            <span>Merchant</span>
            <strong>{{ request.merchantName || "-" }}</strong>
          </div>
          <div v-if="request.accountNumber" class="detail-row">
            <span>Account number</span>
            <strong>{{ request.accountNumber }}</strong>
          </div>
          <div v-if="request.bankName" class="detail-row">
            <span>Bank name</span>
            <strong>{{ request.bankName }}</strong>
          </div>
          <div v-if="request.accountName" class="detail-row">
            <span>Name on account</span>
            <strong>{{ request.accountName }}</strong>
          </div>
          <div v-if="request.narration" class="detail-row">
            <span>Narration</span>
            <strong>{{ request.narration }}</strong>
          </div>
        </div>
        <!-- 
        <button
          class="merchant-link"
          type="button"
          :disabled="!request.merchantId"
          @click="$emit('goToMerchant')"
        >
          Go to merchant's dashboard
        </button> -->
      </div>
    </template>

    <template #modal-cover-footer>
      <div v-if="showActions" class="modal-cover-footer request-modal-footer">
        <template v-if="request.isFunding">
          <button
            class="action-btn cancel-btn"
            type="button"
            @click="$emit('cancel')"
          >
            Cancel
          </button>
          <button
            class="action-btn approve-btn"
            type="button"
            @click="$emit('approve')"
          >
            Approve
          </button>
        </template>
        <template v-else>
          <button
            class="action-btn reject-btn"
            type="button"
            @click="$emit('reject')"
          >
            Reject
          </button>
          <button
            class="action-btn approve-btn"
            type="button"
            @click="$emit('approve')"
          >
            Approve
          </button>
        </template>
      </div>
    </template>
  </ModalDialog>
</template>

<script setup lang="ts">
/* eslint-disable no-undef, vue/valid-define-props, vue/valid-define-emits */
import { computed } from "vue";
import { ModalDialog } from "@packages/uikit";

export type RequestDetail = {
  id?: string | number;
  amount?: string | number;
  currency?: string;
  status?: string;
  date?: string;
  merchantName?: string;
  merchantId?: string | number;
  reference?: string;
  accountNumber?: string;
  bankName?: string;
  accountName?: string;
  narration?: string;
  isFunding?: boolean;
};

const props = withDefaults(
  defineProps<{
    title: string;
    request: RequestDetail;
    showActions?: boolean;
  }>(),
  {
    showActions: true,
  },
);

defineEmits<{
  closeTriggered: [];
  approve: [];
  reject: [];
  cancel: [];
  goToMerchant: [];
}>();

const displayAmount = computed(() => {
  if (props.request.amount === undefined || props.request.amount === null) {
    return "-";
  }

  const amount = props.request.amount.toString();
  return props.request.currency && !amount.includes(props.request.currency)
    ? `${props.request.currency} ${amount}`
    : amount;
});

const statusClass = computed(() => {
  const status = props.request?.status?.toLowerCase().replace(/_/g, " ");

  if (status?.includes("completed")) {
    return "status-success";
  }

  if (status?.includes("failed")) {
    return "status-danger";
  }

  return "status-warning";
});
</script>

<style scoped lang="scss">
.request-modal-header {
  @apply px-8 pt-8 sm:px-5 sm:pt-6;

  h2 {
    @apply text-[28px] font-bold text-grey-900 sm:text-2xl;
  }
}

.request-modal-body {
  @apply flex flex-col gap-8 px-8 pt-8 sm:gap-6 sm:px-5 sm:pt-6;
}

.amount-row {
  @apply flex items-center justify-between gap-5;

  .label {
    @apply mb-2 text-[17px] font-medium text-grey-700;
  }

  h3 {
    @apply text-[30px] font-bold leading-none text-grey-900 sm:text-2xl;
  }
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

.detail-list {
  @apply flex flex-col;
}

.detail-row {
  @apply flex items-center justify-between gap-6 border-b border-grey-100 py-5 text-base;

  span {
    @apply text-grey-600;
  }

  strong {
    @apply max-w-[60%] break-words text-right font-bold text-grey-900;
  }
}

.merchant-link {
  @apply h-12 rounded-lg border border-green-500 px-4 text-sm font-bold text-green-500 transition hover:bg-green-50 disabled:cursor-not-allowed disabled:border-grey-300 disabled:text-grey-400 disabled:hover:bg-transparent;
}

.request-modal-footer {
  @apply flex items-center gap-8 px-8 pb-8 pt-7 sm:flex-col sm:gap-3 sm:px-5 sm:pb-6;
}

.action-btn {
  @apply h-12 w-1/2 rounded-lg border text-sm font-bold text-white transition sm:w-full;
}

.reject-btn {
  @apply border-pink-600 bg-pink-600 hover:bg-pink-700;
}

.cancel-btn {
  @apply border-grey-300 bg-white text-grey-700 hover:bg-grey-50;
}

.approve-btn {
  @apply border-green-500 bg-green-500 hover:bg-green-600;
}
</style>
