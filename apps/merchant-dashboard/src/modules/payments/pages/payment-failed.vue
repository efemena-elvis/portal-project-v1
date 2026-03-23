<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
      
      <div class="flex justify-center mb-4">
        <div class="bg-red-100 text-red-600 rounded-full p-4 text-xl w-12 h-12 flex justify-center items-center">
          ✕
        </div>
      </div>

      <h1 class="text-2xl font-bold text-gray-800 mb-2">
        Payment Failed
      </h1>

      <p class="text-gray-600 mb-6">
        Your payment could not be completed. Please try again or use a different payment method.
      </p>

      <div class="flex flex-col gap-3">
        <button
          class="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
          @click="retryPayment"
        >
          Try Again
        </button>

      
</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAppVariant } from "@packages/hooks";
import { computed, ref } from 'vue';


const appVariant = ref<string>(useAppVariant());

const getDomain = computed(() =>
  appVariant.value === "alexpay"
    ? "https://merchants.alexpay.com"
    : "https://merchant.redstonepgs.com",
);

const router = useRouter();




const retryPayment = () => {
    const paymentId = localStorage.getItem("paymentId");

if (paymentId) {
  localStorage.removeItem("paymentId");
}

const retryUrl = paymentId
  ? `${getDomain.value}/payment-links/pay/${paymentId}`
  : "";
  if (retryUrl) {
    window.location.href = retryUrl;
  } else {
    router.back(); 
  }
};
</script>