<template>
  <div class="mt-4">
    <h5 class="font-bold text-xl text-grey-900">Today</h5>
    <div
      v-for="transaction in allTransactions"
      :key="transaction.id"
      class="table-row"
    >
      <div>
        <p class="text-[13px] text-grey-900 font-[500]">{{ transaction.name }}</p>
        <p class="text-grey-500 text-sm">{{ transaction.email }}</p>
      </div>
      <div>
        <p class="text-[13px] text-grey-900 font-[500]">{{ transaction.paymentMethod }}</p>
        <p class="text-grey-500 text-sm">{{ maskCardNumber(transaction.cardNumber) }}</p>
      </div>
      <p class="text-[13px] text-grey-900 font-[500]">${{ formatNumber(transaction.amount) }}</p>
      <div v-html="transaction.status"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useString } from "@packages/hooks";

const { formatNumber, getStatus, maskCardNumber } = useString();

const allTransactions = [
  {
    name: "Aishat Akinyemi",
    email: "aishat@vesicash.com",
    paymentMethod: "Card",
    cardNumber: "12345678890",
    amount: 500000,
    status: getStatus("successful", "successful"),
    id: 1,
  },
  {
    name: "Chidi Adebayo",
    email: "chiditwee@gmail.com",
    paymentMethod: "Mobile money",
    cardNumber: "45567678796",
    amount: 32500,
    status: getStatus("failed", "failed"),
    id: 2,
  },
  {
    name: "Ola Oluwatobi",
    email: "ola@gmail.com",
    paymentMethod: "Mobile money",
    cardNumber: "27236903560",
    amount: 120500,
    status: getStatus("successful", "successful"),
    id: 2,
  },
];
</script>

<style scoped lang="scss">
.table-row {
  @apply grid grid-cols-4 mt-5 gap-y-6;
}
</style>
