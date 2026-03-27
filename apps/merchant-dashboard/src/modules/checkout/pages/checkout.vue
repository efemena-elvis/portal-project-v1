<template>
  <div class="min-h-screen ring grid place-items-center px-6">
    <div class="w-full max-w-[694px]">
      <CheckoutCard v-if="store.payment_status === 'idle'" />
      <template v-else>
        <PaymentStatusCard :details="store.payment_details" @retry="reset"
        :status="store.payment_status" />
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import CheckoutCard from "@/modules/checkout/components/checkout-card.vue";
import { useMobileMoneyPayment } from "../composables/useMobileMoneyPayment";
import PaymentStatusCard from "../components/payment-status-card.vue";
const { store, reset } = useMobileMoneyPayment();
</script>

<style lang="scss">
body {
  @apply bg-teal-900;
}
</style>
