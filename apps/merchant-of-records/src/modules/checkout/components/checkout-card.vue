<template>
  <div class="rounded-xl bg-gray-50/95 p-6 md:p-4">
    <div class="flex items-center justify-between">
      <img
        :src="renderImg('vesicash-brand.png')"
        alt="brand-logo"
        class="w-40 h-auto object-center"
      />

      <button
        class="size-8 bg-white hover:bg-gray-50 transition-colors rounded-full"
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

      <div class="grid grid-cols-[repeat(auto-fit,_minmax(145.5px,_1fr))] gap-4 my-6">
        <div
          :class="[
            'rounded-lg h-[69px] border-2 grid items-center px-4 transition-colors',
            active_method === item.name
              ? 'border-teal-700 hover:border-teal-500 bg-teal-700 text-white'
              : 'border-white hover:border-teal-300 bg-white text-grey-700',
            item.name !== 'Mobile Money'
              ? 'cursor-not-allowed opacity-45 hidden'
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

      <form class="p-6 bg-white rounded-lg" @submit.prevent="handlePayment">
        <div class="grid grid-cols-2 sm:grid-cols-1 gap-2">
          <TextFieldInput
            :labelId="'customer-first-name'"
            :labelTitle="'First Name'"
            :labelCompact="false"
            :inputType="IInputType.Text"
            :inputValue="first_name"
            :inputPlaceholder="'Enter First Name'"
            isRequired
            @inputChanged="(val) => (first_name = val)"
            :errorHandler="{
              validator: 'validateRequired',
              message: 'First Name is a required field',
            }"
          />
          <TextFieldInput
            :labelId="'customer-last-name'"
            :labelTitle="'Last Name'"
            :labelCompact="false"
            :inputType="IInputType.Text"
            :inputValue="last_name"
            :inputPlaceholder="'Enter Last Name'"
            isRequired
            @inputChanged="(val) => (last_name = val)"
            :errorHandler="{
              validator: 'validateRequired',
              message: 'Last Name is a required field',
            }"
          />
        </div>
        <TextFieldInput
          :labelId="'customer-phone-number'"
          :labelTitle="'Email'"
          :labelCompact="false"
          :inputType="IInputType.Email"
          :inputValue="email"
          :inputPlaceholder="'Enter Email'"
          isRequired
          @inputChanged="(val) => (email = val)"
          :errorHandler="{
            validator: 'validateRequired',
            message: 'Email is a required field',
          }"
        />

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
          type="submit"
        >
          Pay
        </button>
      </form>

      <div class="flex justify-center items-center mt-6">
        <div class="flex gap-x-1 items-center">
          <div>Powered by</div>
          <img
            :src="renderImg('vesicash-brand.svg')"
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
import TextFieldInput from "@packages/uikit/src/components/form-comps/text-field-input.vue";
import { IInputType } from "@packages/models";
import { computed, onMounted, ref, watch } from "vue";
import { useMobileMoneyPayment } from "../composables/useMobileMoneyPayment";
import { useRoute } from "vue-router";
import { useString } from "@packages/hooks";
import { MobileMoneyPaymentRequest } from "../types";
import {
  dialingCodeRegex,
  getDialingCode,
} from "@packages/constants/src/country-currencies";
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
const email = ref("");
const first_name = ref("");
const last_name = ref("");
const {
  fetchPaymentDetails,
  store,
  paymentButtonRef,
  makePayment,
} = useMobileMoneyPayment();

watch(
  () => store.payment_details,
  (details) => {
    if (!details) return;
    const {
      phone_number,
      email: _email,
      customer_first_name,
      customer_last_name,
    } = details;
    email.value = _email ?? "";
    first_name.value = customer_first_name;
    last_name.value = customer_last_name;
    if (!mobile_money_phone_number.value && phone_number) {
      mobile_money_phone_number.value = phone_number.replace(dialingCodeRegex, "");
      mobile_country_code.value = getDialingCode(phone_number);
    }
  }
);

const mobile_money_phone_number = ref(store.payment_details?.phone_number ?? "");
const route = useRoute();
const reference = route.params.reference as string;
onMounted(() => {
  fetchPaymentDetails(reference);
});

const totalCost = computed(() => {
  return (store.payment_details?.amount ?? 0) + (store.payment_details?.charge ?? 0);
});

const hasCharge = computed(() => (store.payment_details?.charge ? true : false));

const handlePayment = () => {
  const payload: MobileMoneyPaymentRequest = {
    account_number: `${mobile_country_code.value}${mobile_money_phone_number.value}`,
    customer_first_name: first_name.value ?? "",
    customer_last_name: last_name.value ?? "",
    email: email.value,
    method: "mobilemoney",
    phone_number: `${mobile_country_code.value}${mobile_money_phone_number.value}`,
  };
  makePayment(reference, payload);
};
</script>
