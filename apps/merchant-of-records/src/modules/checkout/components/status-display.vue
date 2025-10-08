<!-- StatusDisplay.vue -->
<template>
  <div class="status-container">
    <!-- PENDING STATE -->
    <div v-if="status === 'pending'" class="status-content">
      <div class="icon-wrapper is-pending">
        <svg class="spinner" viewBox="0 0 50 50">
          <circle
            class="path"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke-width="5"
          ></circle>
        </svg>
      </div>
      <h1 class="status-title">Processing Payment</h1>
      <p class="status-message">
        Please wait, this will only take a moment. Do not close this window.
      </p>
    </div>

    <!-- SUCCESS STATE -->
    <div v-else-if="status === 'success'" class="status-content">
      <div class="icon-wrapper is-success">
        <svg fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M4.5 12.75l6 6 9-13.5"
          />
        </svg>
      </div>
      <h1 class="status-title">Payment Successful</h1>

      <p class="status-message">
        Thank you! Your payment has been processed successfully.
      </p>

      <div class="transaction-details">
        <span>Transaction REF:</span>
        <span>{{ getPaymentReference }}</span>
      </div>

      <div class="action-buttons">
        <button class="secondary-button" @click="exitPayment">Done</button>
      </div>
    </div>

    <!-- FAILED STATE -->
    <div v-else-if="status === 'failed'" class="status-content">
      <div class="icon-wrapper is-failed">
        <svg fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>

      <h1 class="status-title">Payment Failed</h1>

      <p class="status-message">
        Unfortunately, we were unable to process your payment. Please try again.
      </p>

      <div class="action-buttons">
        <button class="btn btn-primary btn-md !font-bold w-full" @click="exitPayment">
          Exit Payment
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { useString } from "@packages/hooks";
import { useMobileMoneyPayment } from "../composables/useMobileMoneyPayment";

defineProps({
  status: {
    type: String,
    required: true,
    validator: (value: string) => ["pending", "success", "failed"].includes(value),
  },
});

const route = useRoute();
const { createAndClickAnchor } = useString();
const { getPaymentReference } = useMobileMoneyPayment();

const exitPayment = () => {
  const redirect_url = route.query.redirect_url as string;
  createAndClickAnchor(redirect_url, "_self", true);
};
</script>

<style lang="scss" scoped>
.status-container {
  @apply relative mt-20 bg-neutral-10 rounded-xl shadow-lg w-full max-w-md mx-auto p-8 md:p-6 sm:px-4 text-center;
  @apply transition-all duration-300;
}

.status-content {
  @apply flex flex-col items-center;
}

.icon-wrapper {
  @apply h-20 w-20 rounded-full flex items-center justify-center mb-5;

  svg {
    @apply size-10 min-w-10 min-h-10 text-neutral-10;
  }

  &.is-pending {
    @apply bg-gray-200;
    svg {
      @apply text-gray-600;
    }
  }
  &.is-success {
    @apply bg-green-500;
  }
  &.is-failed {
    @apply bg-red-500;
  }
}

.status-title {
  @apply text-2xl font-bold text-gray-800;
}

.status-message {
  @apply text-gray-500 mt-2 max-w-xs mx-auto;
}

.transaction-details {
  @apply bg-gray-50 w-full text-sm rounded-lg p-3 mt-6 flex justify-between;
  span:first-child {
    @apply text-gray-500;
  }
  span:last-child {
    @apply font-mono text-gray-700 font-medium;
  }
}

.action-buttons {
  @apply w-full mt-8 space-y-3;
}

.secondary-button {
  @apply w-full text-gray-600 font-bold py-3 px-4 rounded-lg;
  @apply transition-colors duration-200;
  @apply hover:bg-gray-100;
  @apply focus:outline-none focus:ring-2 focus:ring-gray-300;
}

// Spinner animation
.spinner {
  animation: rotate 2s linear infinite;

  .path {
    stroke: #3ab75d;
    stroke-linecap: round;
    animation: dash 1.5s ease-in-out infinite;
  }
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}
</style>
