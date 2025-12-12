<template>
  <ModalDialog @closeModal="$emit('closeTriggered')">
    <!-- HEADER -->
    <template #modal-cover-header>
      <div class="modal-cover-header">
        <div class="modal-cover-title">Transaction Details</div>
      </div>
    </template>

    <!-- BODY -->
    <template #modal-cover-body>
      <div class="modal-cover-body mt-3 max-h-[500px]">
        <div
          v-if="isLoading"
          class="flex flex-col items-center justify-center text-teal-700 py-6"
        >
          <svg
            class="animate-spin h-6 w-6 mb-2 text-teal-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          <p>Loading transaction log...</p>
        </div>

        <div v-else-if="transactionData" class="p-4 rounded-lg">
          <div class="grid grid-cols-3 gap-4 text-sm">
            <div v-for="(field, index) in displayFields" :key="index">
              <p class="text-gray-500 uppercase text-xs">{{ field.label }}</p>
              <p
                v-if="field.key === 'status'"
                :class="[
                  'font-semibold rounded-full p-1 text-center text-white w-24 mt-1',
                  transactionData.status === 'successful'
                    ? 'bg-green-400 text-green-100'
                    : transactionData.status === 'pending'
                      ? 'bg-yellow-400 text-yellow-100'
                      : 'bg-red-400 text-red-100',
                ]"
              >
                {{ capitalize(transactionData.status) }}
              </p>
              <p
                v-else
                class="font-semibold text-grey-900 break-all text-sm mt-1"
              >
                {{ formatValue(field.key) }}
              </p>
            </div>
          </div>

          <div class="mt-4" v-if="transactionData.status === 'failed'">
            <p class="text-gray-500">Reason</p>
            <p class="font-sm text-gray-700 mt-1">
              {{ transactionData.reason_for_failure || "—" }}
            </p>
          </div>
        </div>

        <div v-else class="text-center text-[16px] text-teal-700">
          Log not found for the selected transaction.
        </div>
      </div>
    </template>
  </ModalDialog>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { ModalDialog } from "@packages/uikit";
import { useEvents, useDate, useString } from "@packages/hooks";
import { usePaymentStore } from "../store";

const { processAPIRequest } = useEvents();
const { getSingleTransaction } = usePaymentStore();
const { formatNumber } = useString();

const isLoading = ref(false);
const transactionData = ref<any>(null);

const emits = defineEmits(["closeTriggered"]);
const props = defineProps<{ transaction: any }>();

const displayFields = [
  { label: "Amount Paid", key: "amount" },
  { label: "Charge", key: "charge" },
  { label: "Currency", key: "currency" },
  { label: "Reference ID", key: "reference" },
  { label: "Date", key: "created_at" },
  { label: "Time", key: "created_at_time" },
  { label: "Payment Method", key: "method" },
  { label: "Customer Name", key: "full_name" },
  { label: "Email", key: "email" },
  { label: "MOMO Number", key: "phone_number" },
  { label: "Operator", key: "operator" },
  { label: "Business ID", key: "business_id" },
  { label: "Redirect URL", key: "redirect_url" },
  { label: "Environment", key: "environment" },
  { label: "Type", key: "type" },
  { label: "Attempts", key: "attempts" },
  { label: "Status", key: "status" },

];

const getTransactionDate = (date: string) => {
  let { w2, m3, d3, y1 } = useDate.formatDate(date).getAll();
  return `${w2}, ${d3} ${m3}, ${y1}`;
};
const capitalize = (text: string) =>
  text ? text.charAt(0).toUpperCase() + text.slice(1) : "";

const fetchSingleTransaction = async () => {
  isLoading.value = true;
  const response = await processAPIRequest({
    action: getSingleTransaction,
    payload: { ref: props.transaction?.reference },
  });

  transactionData.value =
  response.code === 200 ? response.data : props.transaction;
  isLoading.value = false;
};

const formatValue = (key: string) => {
  if (!transactionData.value) return "";

  switch (key) {
    case "amount":
      return `${transactionData.value.currency}${formatNumber(transactionData.value.amount).toLocaleString()}`;
    case "created_at":
      return getTransactionDate(transactionData.value.created_at);
    case "created_at_time":
      return useDate.formatTime(transactionData.value.created_at);
    case "full_name":
      return transactionData.value.customer_first_name &&
        transactionData.value.customer_last_name
        ? `${transactionData.value.customer_first_name} ${transactionData.value.customer_last_name}`
        : "—";
    case "charge":
      return `${transactionData.value.currency}${formatNumber(transactionData.value.charge).toLocaleString() ?? 0}`;
    default:
      const value = transactionData.value[key];
      return value || value === 0 ? value : "—";
  }
};

onMounted(fetchSingleTransaction);
</script>

<style lang="scss" scoped>
.modal-cover-body {
  @apply h-[350px];
}
.modal-cover-title {
  @apply text-lg font-semibold text-gray-800;
}
</style>
