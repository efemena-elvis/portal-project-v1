<template>
  <div class="checkout-background">
    <!-- CLOSE ACTION -->
    <div class="close-icon" @click="router.back()" title="Close checkout">
      <div class="icon icon-times"></div>
    </div>

    <div class="loading-indicator" v-if="checkoutLoading">
      <div class="icon icon-spinner-ios animate-spin"></div>
    </div>

    <div class="checkout-container" v-else>
      <!-- Header Section -->
      <header class="checkout-header">
        <img
          :src="renderImg('vesicash-brand.png')"
          alt="brand-logo"
          class="brand-logo"
        />

        <div class="payment-info">
          <div class="payment-info-email">
            {{ paymentEmail || "Amount to pay" }}
          </div>
          <div class="payment-info-amount">
            <span>{{ paymentCurrency }} {{ formatNumber(paymentAmount) }}</span>
          </div>
        </div>
      </header>

      <!-- Payment Method Selection -->
      <PaymentMethodSelector v-model="selectedPaymentMethod" />

      <!-- Dynamic Payment Forms -->
      <main class="mt-6 mb-8">
        <MobileMoneyForm
          :dialingCode="paymentCountryCode"
          :initphoneNumber="mobileMoneyPhoneNumber"
          v-model:phoneNumber="mobileMoneyPhoneNumber"
          v-model:email="paymentEmail"
          v-model:firstName="customer_first_name"
          v-model:lastName="customer_last_name"
          v-if="selectedPaymentMethod === 'mobileMoney'"
        />

        <CardForm
          :customer_details="customerDetails"
          :reference="reference"
          v-if="selectedPaymentMethod === 'card'"
          :redirect_url="paymentDetails?.redirect_url"
          :currency="paymentCurrency"
          :amount="paymentAmount"
        />
      </main>

      <!-- CTA and Security Footer -->
      <footer class="checkout-footer">
        <button
          class="btn btn-primary btn-md !font-bold w-full"
          ref="paymentButtonRef"
          @click="processPayment"
          v-if="selectedPaymentMethod === 'mobileMoney'"
        >
          Pay {{ paymentCurrency }} {{ formatNumber(paymentAmount) }}
        </button>

        <div class="security-badge">
          <svg
            class="lock-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            ></path>
          </svg>

          <span>Secured by <strong>Vesicash</strong></span>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import PaymentMethodSelector from "../components/payment-method-selector.vue";
import MobileMoneyForm from "../components/mobile-money-form.vue";
// import CardPaymentForm from "../components/card-payment-form.vue";
import CardForm from "../components/card-form.vue";
import { useImage } from "@/shared/composables";
import { useMobileMoneyPayment } from "../composables/useMobileMoneyPayment";
import {
  getCountryByCurrencyShort,
  getCountryByCode,
} from "@packages/constants";
import { useEvents, useString } from "@packages/hooks";

const router = useRouter();
const route = useRoute();
const { pushToastAlert } = useEvents();
const { formatNumber } = useString();

const reference = route.params.reference as string;

const { renderImg } = useImage();

const { fetchPaymentDetails, paymentDetails, paymentButtonRef, makePayment } =
  useMobileMoneyPayment();

const selectedPaymentMethod = ref(
  paymentDetails.value?.method === "card" ? "card" : "mobileMoney",
);

const customerDetails = computed(() => {
  return {
    // phone_number: store?.payment_details?.phone_number || "+233-alexpay",
    email: paymentDetails.value?.email || "",
    customer_first_name: paymentDetails.value?.customer_first_name || "",
    customer_last_name: paymentDetails.value?.customer_last_name || "",
  };
});

const checkoutLoading = ref<boolean>(true);

const paymentCountryCode = ref("");
const paymentCountry = ref("");
const paymentCurrency = ref("");

const paymentEmail = ref("");
const paymentAmount = ref(0);

const mobileMoneyPhoneNumber = ref("");
const customer_first_name = ref("");
const customer_last_name = ref("");
const paymentRedirectURL = ref("");

const getTransactionDetails = computed(() => {
  return {
    phone_number: `${paymentCountryCode.value}${mobileMoneyPhoneNumber.value}`,
    method: selectedPaymentMethod.value.toLowerCase(),
    country: paymentCountry.value,
    business_name: "Vesicash",
    customer_first_name: customer_first_name.value,
    customer_last_name: customer_last_name.value,
    email: paymentEmail.value,
    reference,
  };
});

// PROCESS PAYMENT
const processPayment = () => {
  if (selectedPaymentMethod.value === "mobileMoney") {
    if (mobileMoneyPhoneNumber.value.length < 10) {
      pushToastAlert({
        message: "Please enter a valid phone number.",
        type: "error",
      });
      return;
    }
    if (!paymentEmail.value.includes("@")) {
      pushToastAlert({
        message: "Please enter a valid email address.",
        type: "error",
      });
      return;
    }
    if (!customer_first_name.value) {
      pushToastAlert({
        message: "Please enter your first name.",
        type: "error",
      });
      return;
    }
    if (!customer_last_name.value) {
      pushToastAlert({
        message: "Please enter your last name.",
        type: "error",
      });
      return;
    }
  }

  makePayment(getTransactionDetails.value, paymentRedirectURL.value);
};

watch(
  () => paymentDetails.value,
  (transaction_details) => {
    if (!transaction_details) return;

    setTimeout(() => (checkoutLoading.value = false), 500);

    const {
      currency,
      country,
      country_code,
      amount,
      redirect_url,
      phone_number,
      customer_first_name: first_name,
      customer_last_name: last_name,
      email,
      method,
      payment_method_data,
    } = transaction_details;

    // Use DCC base currency and amount if available
    const dcc = payment_method_data?.dcc;
    const effectiveCurrency = dcc?.base_currency || currency;
    const effectiveAmount = dcc?.base_amount || amount;

    const countryPayload = getCountryByCurrencyShort(
      effectiveCurrency || "ZMW",
    );
    selectedPaymentMethod.value = method === "card" ? "card" : "mobileMoney"; // method

    paymentCurrency.value = effectiveCurrency ?? null;
    paymentCountry.value =
      country || (getCountryByCode(country_code)?.country as string);
    paymentCountryCode.value = countryPayload?.dialing_code || "260";

    paymentRedirectURL.value =
      redirect_url || payment_method_data?.redirect_success_url || "";
    paymentAmount.value = effectiveAmount ?? 0;
    mobileMoneyPhoneNumber.value = phone_number || "";
    customer_first_name.value = first_name || "";
    customer_last_name.value = last_name || "";
    paymentEmail.value = email || "";
  },
);

fetchPaymentDetails();
</script>

<style lang="scss" scoped>
.checkout-background {
  @apply relative bg-gray-50 min-h-screen flex items-start justify-center p-4;

  .checkout-container {
    @apply relative top-20 bg-neutral-10 rounded-xl shadow-lg w-full max-w-md mx-auto p-7 md:p-6 sm:px-4 transition-all duration-300 ease-in-out;

    .checkout-header {
      @apply flex justify-between items-center mb-10;

      img {
        @apply w-36 h-auto object-contain;
      }

      .payment-info {
        @apply flex flex-col gap-y-0.5 justify-center items-end text-gray-500;

        &-email {
          @apply text-[13px];
        }

        &-amount {
          @apply text-sm;

          span {
            @apply text-green-500 font-bold;
          }
        }
      }
    }
  }
}

.close-icon {
  @apply fixed size-10 md:size-8 min-w-10 md:min-w-8 min-h-10 md:min-h-8 rounded-full flex justify-center items-center top-10 right-14 md:right-8 sm:right-4 bg-grey-200/50 cursor-pointer transition-all duration-300 hover:bg-red-100/60;

  .icon {
    @apply text-grey-600 text-2xl md:text-xl;
  }
}

.loading-indicator {
  @apply fixed -mt-9 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2;

  .icon {
    @apply text-6xl text-green-500 font-bold;
  }
}

.security-badge {
  @apply flex items-center justify-center mt-6 text-gray-500 text-xs;

  .lock-icon {
    @apply w-4 h-4 mr-1.5;
  }

  strong {
    @apply font-semibold text-gray-600;
  }
}
</style>
