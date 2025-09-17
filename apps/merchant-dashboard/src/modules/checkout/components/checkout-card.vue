<template>
  <div class="rounded-xl bg-gray-50/95 p-6 md:p-4">
    <div class="flex items-center justify-between">
      <img
        :src="renderImg('alexpay-logo.png')"
        alt="brand-logo"
        class="w-[96px] h-[32px] object-center"
      />

      <button
        class="size-[28px] bg-white hover:bg-gray-50 transition-colors rounded-full"
        title="Close checkout"
      >
        <div class="icon icon-times"></div>
      </button>
    </div>

    <template v-if="store.fetching_payment_details">
      <div class="space-y-10 my-6">
        <div class="h-12 bg-slate-300 animate-pulse rounded-md"></div>

        <div class="h-12 bg-slate-300 animate-pulse rounded-md"></div>

        <div class="h-12 bg-slate-300 animate-pulse rounded-md"></div>

        <div class="h-12 bg-slate-300 animate-pulse rounded-md"></div>
      </div>
    </template>

    <template v-else>
      <div class="my-6 space-y-1">
        <div class="flex flex-wrap justify-between items-center gap-4">
          <div class="bg-white text-green-700 font-bold text-lg p-4 rounded-lg">
            {{ store?.payment_details?.currency }} {{ formatNumber(totalCost) }}
          </div>
          <div class="text-teal-800 font-medium">
            {{ store?.payment_details?.email }}
          </div>
        </div>
        <div class="text-sm text-gray-500" v-if="hasCharge">
          This total cost includes a
          <b
            >{{ store.payment_details?.currency
            }}{{ formatNumber(store.payment_details?.charge ?? 0) }}</b
          >
          charge
        </div>
      </div>

      <div
        class="grid grid-cols-[repeat(auto-fit,_minmax(145.5px,_1fr))] gap-4 my-6"
      >
        <div
          :class="[
            'rounded-lg h-[69px] border-2 grid items-center px-4 transition-colors',
            active_method === item.name
              ? 'border-teal-700 hover:border-teal-500 bg-teal-700 text-white'
              : 'border-white hover:border-teal-300 bg-white text-grey-700',
            item.name !== 'Mobile Money'
              ? 'cursor-not-allowed opacity-45'
              : 'cursor-pointer',
          ]"
          v-for="item in payment_methods"
          :key="item.name"
          @click="active_method = 'Mobile Money'"
        >
          <!-- <div class="size-[24px] border"></div> -->
          <div class="text-sm font-medium text-center uppercase">
            {{ item.name }}
          </div>
        </div>
      </div>

      <div class="p-6 bg-white rounded-lg">
        <PhoneFieldInput
          :labelId="'mobile-money-phone-number'"
          :labelTitle="'Phone number'"
          :labelCompact="false"
          :inputPlaceholder="'Enter your phone number'"
          :inputValue="mobile_money_phone_number"
          isRequired
          :activeCountryCode="mobile_country_code"
          @countryCodeChanged="mobile_country_code = $event"
          @inputChanged="(val) => (mobile_money_phone_number = val)"
        />
        <button
          class="btn btn-primary w-full btn-sm"
          ref="paymentButtonRef"
          @click="handlePayment"
          :disabled="!mobile_money_phone_number"
        >
          Pay
        </button>
      </div>

      <div class="flex justify-center items-center mt-6">
        <div class="flex gap-x-1 items-center border">
          <div>Powered by</div>
          <img
            :src="renderImg('alexpay-logo.png')"
            class="w-[60.41px] h-[20px] object-center mt-1"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { useImage } from "@/shared/composables";
import PhoneFieldInput from "@packages/uikit/src/components/form-comps/phone-field-input.vue";
import { computed, onMounted, ref, watch } from "vue";
import { useMobileMoneyPayment } from "../composables/useMobileMoneyPayment";
import { useRoute } from "vue-router";
import { useString } from "@packages/hooks";
import { MobileMoneyPaymentRequest } from "../types";
const { renderImg } = useImage();
const { formatNumber } = useString();

const active_method = ref("Mobile Money");
const payment_methods = [
  {
    name: "Card",
  },
  {
    name: "Mobile Money",
  },
  {
    name: "Bank transfer",
  },
  {
    name: "USSD",
  },
];

const mobile_country_code = ref("260");
const { fetchPaymentDetails, store, paymentButtonRef, makePayment } =
  useMobileMoneyPayment();

const refinedPaymentMobileNumber = computed(() => {
  if (store.payment_details?.phone_number)
    return store.payment_details.phone_number.replace("+", "");
  return "";
});

watch(refinedPaymentMobileNumber, (number) => {
  if (!mobile_money_phone_number.value)
    mobile_money_phone_number.value = number;
});

const mobile_money_phone_number = ref(refinedPaymentMobileNumber.value);
const route = useRoute();
const reference = route.params.reference as string;
onMounted(() => {
  fetchPaymentDetails(reference);
});

const totalCost = computed(() => {
  return (
    (store.payment_details?.amount ?? 0) + (store.payment_details?.charge ?? 0)
  );
});

const hasCharge = computed(() =>
  store.payment_details?.charge ? true : false
);

const handlePayment = () => {
  const payload: MobileMoneyPaymentRequest = {
    account_number: `${mobile_country_code.value}${mobile_money_phone_number.value}`,
    customer_first_name: store.payment_details?.customer_first_name ?? "",
    customer_last_name: store.payment_details?.customer_last_name ?? "",
    email: store.payment_details?.email ?? "",
    method: "mobilemoney",
    phone_number: `${mobile_country_code.value}${mobile_money_phone_number.value}`,
  };
  makePayment(reference, payload);
};
</script>
