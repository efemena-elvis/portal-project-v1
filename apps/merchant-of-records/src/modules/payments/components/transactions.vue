<template>
  <div>
    <div class="flex sm:flex-wrap flex-nowrap sm:gap-4 gap-8 my-6 text-[12px]">
      <div
        v-for="(option, index) in filterOptions"
        :key="index"
        class="relative bg-grey-10 cursor-pointer p-2 text-grey-500 rounded-lg flex items-center sm:gap-2 gap-4"
        @click="toggleDropdown(index)"
      >
        <p>{{ option.category }}</p>
        <div class="icon-caret-down text-lg"></div>

        <!-- Dropdown panel -->
        <div
          :class="[
            'absolute transition-all ease-in-out duration-300 top-full mt-2 left-0 z-10 bg-white shadow-lg rounded-md overflow-hidden',
            activeDropdown === index ? 'max-h-60 py-2' : 'max-h-0 py-0',
          ]"
        >
          <p
            v-for="opt in option.options"
            :key="opt"
            class="px-4 py-2 w-40 hover:bg-grey-100 text-grey-500 cursor-pointer"
            @click.stop="selectFilter(option.category, opt)"
          >
            {{ opt }}
          </p>
        </div>
      </div>
      <div
        class="bg-grey-10 cursor-pointer p-2 text-grey-500 rounded-lg flex items-center gap-2 md:gap-4"
      >
        <p class="text-grey-500">Select date</p>
        <div class="icon-calendar text-lg"></div>
      </div>
    </div>
    <!-- Show only filters that have a value -->
    <div
      class="flex gap-4"
      v-if="selectedFilters.some((filter) => filter.value)"
    >
      <div
        v-for="(filter, index) in selectedFilters.filter((item) => item.value)"
        :key="index"
        class="flex items-center gap-2 border border-grey-300 rounded-full py-2 px-3 text-grey-900"
      >
        <p class="text-sm">{{ filter.value }}</p>
        <button
          @click="clearFilter(filter.category)"
          class="text-grey-500 border border-grey-300 p-2 h-5 w-5 rounded-full flex items-center justify-center hover:text-grey-700 font-bold"
        >
          <div class="icon-times mt-1"></div>
        </button>
      </div>
    </div>
    <div class="mt-8">
      <h5 class="font-bold text-lg md:text-xl text-grey-900">Today</h5>
      <div
        v-for="transaction in allTransactions"
        :key="transaction.id"
        class="table-row"
      >
        <div>
          <p class="text-lg text-grey-900 font-medium">
            {{ transaction.name }}
          </p>
          <p class="text-grey-500 text-sm">{{ transaction.email }}</p>
        </div>
        <div>
          <p class="text-lg text-grey-900 font-medium">
            {{ transaction.paymentMethod }}
          </p>
          <p class="text-grey-500 text-sm">
            {{ maskCardNumber(transaction.cardNumber) }}
          </p>
        </div>
        <p class="text-lg text-grey-900 font-medium">
          ${{ formatNumber(transaction.amount) }}
        </p>
        <div v-html="transaction.status"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
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
    id: 3,
  },
];

const filterOptions = [
  {
    category: "Payment method",
    options: ["Card", "Mobile money"],
  },
  {
    category: "Payment provider",
    options: ["Alex pay", "Vesipay"],
  },
  {
    category: "Status",
    options: ["Successful", "Pending", "Failed"],
  },
];

const selectedFilters = ref(
  filterOptions.map((option) => ({
    category: option.category,
    value: "",
  }))
);

const activeDropdown = ref<number | null>(null);

function toggleDropdown(index: number) {
  activeDropdown.value = activeDropdown.value === index ? null : index;
}

function selectFilter(category: string, value: string) {
  const target = selectedFilters.value.find(
    (option) => option.category === category
  );
  if (target) {
    target.value = value;
  }
  activeDropdown.value = null;
}

function clearFilter(category: string) {
  const target = selectedFilters.value.find(
    (filter) => filter.category === category
  );
  if (target) {
    target.value = "";
  }
}
</script>

<style scoped lang="scss">
.table-row {
  @apply grid grid-cols-4 sm:grid-cols-2 mt-5 sm:gap-y-4 gap-y-6 border-b pb-4 items-center;
}
</style>
