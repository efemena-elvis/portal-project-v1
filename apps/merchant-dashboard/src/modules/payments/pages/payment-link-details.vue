<template>
  <!-- Loader -->
  <div v-if="isLoading" class="min-h-screen flex items-center justify-center p-4">
    <div class="w-[400px] sm:w-full">
      <TableLoading />
    </div>
  </div>

  <!-- Page content -->
  <div v-else class="min-h-screen flex items-center justify-center p-4">
  <div
  v-if="paymentLinkDetails.status !== 'active'"
  class="text-center bg-white p-8 rounded-xl shadow-md w-[400px]"
>
  <p class="text-lg font-semibold text-gray-700">
    {{ paymentLinkDetails?.message }}
  </p>
</div>

    <div
      v-else
      v-if="paymentLinkDetails"
      :style="{ backgroundColor: paymentLinkPayload.background_color }"
      class="p-6 rounded-[14px] shadow-md w-[400px] sm:w-full"
    >
      <img
        v-if="paymentLinkPayload.logo_url"
        :src="paymentLinkPayload?.logo_url"
        alt="logo"
        class="w-[60px] h-[60px] aspect-square rounded-md border border-grey-200"
      />

      <div class="flex flex-col gap-1 mt-6 font-semibold">
        <label for="amount">Amount</label>
        <div class="border-b pb-1 font-bold flex gap-1 text-xl">
          <span>{{ currencySymbol }}</span>
          <input
            type="number"
            placeholder="0.00"
            :disabled="!paymentLinkPayload.allow_amount_edit"
            v-model="paymentLinkPayload.amount"
            class="bg-transparent focus:outline-none"
          />
        </div>
        <span
          class="text-sm text-grey-300 font-normal"
          v-if="paymentLinkPayload.allow_amount_edit"
        >
          Enter Amount
        </span>
      </div>

      <div class="space-y-2 mt-4">
        <p class="font-semibold">Description</p>
        <span>{{ paymentLinkPayload.description }}</span>
      </div>

      <div class="mt-4 modal-cover-footer -mx-6">
        <button
          class="w-full btn btn-primary cursor-pointer"
          ref="makePaymentBtnRef"
          :disabled="isActionReady"
          @click="handleMakePayment"
        >
          Make Payment
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useEvents, useString } from "@packages/hooks";
import { usePaymentStore } from "@/modules/payments/store";
import { countryCurrencies } from "@packages/constants";
import { TableLoading } from "@packages/uikit";

const emits = defineEmits(["closeTriggered", "reloadPaymentLinks"]);

const route = useRoute();
const router = useRouter();
const { processAPIRequest} = useEvents();
const { fetchSinglePaymentLink} = usePaymentStore();

const paymentLinkDetails = ref<any>({});
const isLoading = ref<boolean>(true);

const paymentLinkPayload = computed(() => paymentLinkDetails.value);

const makePaymentBtnRef = ref(null);
const isActionReady = computed(() => !paymentLinkPayload.value.amount);

const currencySymbol = computed(() => {
  const countryCurrency = countryCurrencies.find(
    (country) => country.currency.short === paymentLinkDetails.value?.currency,
  );
  return countryCurrency?.currency.sign;
});

const handleMakePayment = async () => {
  return router.push(`/payment-links/pay/${route.params.id}`)
};

const fetchPaymentLinkById = async () => {
  isLoading.value = true;

  const response = await processAPIRequest({
    action: fetchSinglePaymentLink,
    payload: { id: route.params.id },
    showAlert: false,
  });

  if (response && response.code === 200 && response.data) {
    paymentLinkDetails.value = response.data;
  } else {
    paymentLinkDetails.value = {
      status: "unavailable",
      message: "This payment link is inactive or no longer available.",
    };
  }

  isLoading.value = false;
};

onMounted(() => fetchPaymentLinkById());
</script>

<style scoped lang="scss"></style>
