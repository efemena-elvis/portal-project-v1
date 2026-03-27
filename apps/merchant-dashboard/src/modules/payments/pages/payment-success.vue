<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
      
      <div class="flex justify-center mb-4">
        <div class="bg-green-100 text-green-600  rounded-full p-4 w-12 h-12 flex justify-center items-center">
          ✓
        </div>
      </div>

      <h1 class="text-2xl font-bold text-gray-800 mb-2">
        Payment Successful
      </h1>

      <p class="text-gray-600 mb-6">
        Thank you for your payment. Your transaction was completed successfully.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

onMounted(() =>   localStorage.removeItem("PaymentReference"))
</script>