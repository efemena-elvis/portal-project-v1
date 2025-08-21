<template>
  <div class="rounded-xl bg-gray-50/95 p-6 md:p-4 grid place-items-center">
    <div class="size-20 mx-auto my-6">
      <img
        :src="status.icon"
        alt="PendingPayment"
        class="object-cover h-full w-full"
      />
    </div>
    <div class="text-lg font-semibold text-teal-900">{{ status.title }}</div>
    <div class="max-w-[600px] mx-auto my-6 text-center text-gray-700">
      {{ status.description }}
    </div>
    <button
      class="btn btn-lg btn-primary"
      v-if="details?.status === 'failed'"
      @click="$emit('retry')"
    >
      Retry
    </button>

    <div class="flex justify-center items-center mt-6">
      <div class="flex gap-x-1 items-center border">
        <div>Powered by</div>
        <img
          :src="renderImg('alexpay-logo.png')"
          class="w-[60.41px] h-[20px] object-center mt-1"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useImage } from "@/shared/composables";
import { PaymentDetails } from "../types";
import { computed } from "vue";
import { useString } from "@packages/hooks";
const { renderImg } = useImage();
const { details } = defineProps<{ details: PaymentDetails | null }>();
defineEmits(["retry"]);

const status = computed(() => {
  switch (details?.status) {
    case "failed":
      return {
        title: "Payment Failed",
        description: `Oops! Something went wrong with your payment. Please check your
          details and try again. If the issue persists, contact your bank or our
          support team.`,
        icon: renderImg("failed-payment.png"),
      };
    case "pending":
      return {
        title: "Processing your payment",
        description: `Hang tight! We're processing your payment. This should take a few
          moments. Please do not refresh or close this page.`,
        icon: renderImg("pending-payment.png"),
      };
    case "success":
      return {
        title: "Payment Successful",
        description: `Thank you! Your payment of ${details?.currency ?? ""}
          ${formatNumber(details?.amount ?? 0)} has been successfully
          processed. A receipt has been sent to your email. You may now continue
          with your transaction.`,
        icon: renderImg("success-payment.png"),
      };
    default:
      return {
        title: "Processing your payment",
        description: `Hang tight! We're processing your payment. This should take a few
          moments. Please do not refresh or close this page.`,
        icon: renderImg("pending-payment.png"),
      };
  }
});

const { formatNumber } = useString();
</script>
