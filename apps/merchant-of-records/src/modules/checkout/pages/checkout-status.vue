<!-- PaymentStatusPage.vue -->
<template>
  <div class="page-background">
    <!-- The core status display component -->
    <StatusDisplay :status="currentStatus" />

    <!-- Simulator Controls for Demonstration -->
    <!-- <div class="simulator-controls">
      <p>Simulate State Change:</p>
      <div class="button-group">
        <button @click="setStatus('pending')">Pending</button>
        <button @click="setStatus('success')">Success</button>
        <button @click="setStatus('failed')">Failed</button>
      </div>
    </div> -->
  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import StatusDisplay from "../components/status-display.vue";
import { useMobileMoneyPayment } from "../composables/useMobileMoneyPayment";

// Get the composable's functions
const { startPaymentPolling } = useMobileMoneyPayment();

const route = useRoute();

const currentStatus = computed(() => route.query.status);

onMounted(() => {
  if (route.query.status === "pending") {
    startPaymentPolling();
  }
});
</script>

<style lang="scss" scoped>
.page-background {
  @apply bg-gray-50 min-h-screen flex flex-col items-center justify-start p-4;
}

// Styles for the demo controls, not part of the core component UI
.simulator-controls {
  @apply bg-white border border-gray-200 rounded-lg p-4 mt-8 text-center;
  p {
    @apply text-sm text-gray-600 font-medium mb-3;
  }
  .button-group {
    @apply flex items-center gap-3;
    button {
      @apply px-4 py-1.5 bg-gray-200 text-gray-800 text-xs font-bold rounded-md;
      @apply hover:bg-gray-300 transition-colors;
    }
  }
}
</style>
