<template>
  <div v-if="isLoading" class="flex items-center justify-center p-4">
    <div class="w-[600px] sm:w-full">
      <TableLoading />
    </div>
  </div>
  <div class="max-w-xl mx-auto py-10 px-4" v-else>
    <div class="text-2xl font-bold mb-6">Pay via Payment Link</div>

    <!-- CUSTOMER INFO -->
    <TextFieldInput
      labelId="email"
      labelTitle="Email"
      :labelCompact="false"
      :inputType="IInputType.Email"
      inputPlaceholder="customer@email.com"
      :inputValue="payload.email"
      @inputChanged="payload.email = $event"
      isRequired
    />

    <TextFieldInput
      labelId="firstName"
      labelTitle="First Name"
      :labelCompact="false"
      :inputType="IInputType.Text"
      inputPlaceholder="John"
      :inputValue="payload.customer_first_name"
      @inputChanged="payload.customer_first_name = $event"
      isRequired
    />

    <TextFieldInput
      labelId="lastName"
      labelTitle="Last Name"
      :labelCompact="false"
      :inputType="IInputType.Text"
      inputPlaceholder="Doe"
      :inputValue="payload.customer_last_name"
      @inputChanged="payload.customer_last_name = $event"
      isRequired
    />

    <SelectFieldInput
      labelId="method"
      labelTitle="Payment Method"
      inputPlaceholder="Select payment method"
      :inputValue="payload.method"
      :selectData="paymentMethods"
      @onSelectionChange="onMethodChange"
      isRequired
    />

    <!-- PHONE NUMBER (Mobile money only) -->
    <TextFieldInput
      v-if="payload.method === 'mobilemoney'"
      labelId="phone"
      labelTitle="Phone Number"
      :labelCompact="false"
      :inputType="IInputType.Text"
      inputPlaceholder="001234567"
      :inputValue="payload.phone_number"
      @inputChanged="payload.phone_number = $event"
    />

    <!-- CARD REDIRECT URLS -->
    <TextFieldInput
      v-if="payload.method === 'card'"
      labelId="redirect_success"
      labelTitle="Redirect Success URL"
      :labelCompact="false"
      :inputType="IInputType.Text"
      :isDisabled="true"
      :inputValue="payload.redirect_success_url"
      isRequired
    />

    <TextFieldInput
      v-if="payload.method === 'card'"
      labelId="redirect_failed"
      labelTitle="Redirect Failed URL"
      :labelCompact="false"
      :isDisabled="true"
      :inputType="IInputType.Text"
      :inputValue="payload.redirect_failed_url"
      isRequired
    />

    <TextFieldInput
      labelId="amount"
      labelTitle="Amount"
      :labelCompact="false"
      :inputType="IInputType.Number"
      inputPlaceholder="0.00"
      :inputValue="payload.amount"
      @inputChanged="payload.amount = $event"
      isRequired
    />

    <button
      class="btn btn-primary w-full mt-6"
      ref="payBtnRef"
      :disabled="isActionReady"
      @click="handlePayment"
    >
      Pay Now
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import {
  TextFieldInput,
  SelectFieldInput,
  TableLoading,
} from "@packages/uikit";
import { IInputType } from "@packages/models";
import { useEvents, useAppVariant, useString } from "@packages/hooks";
import { usePaymentStore } from "@/modules/payments/store";

const route = useRoute();
const { processAPIRequest, pushToastAlert } = useEvents();
const { fetchSinglePaymentLink, payViaPaymentLink } = usePaymentStore();
const { createAndClickAnchor } = useString();

const appVariant = ref<string>(useAppVariant());
const payBtnRef = ref(null);
const isLoading = ref(true);

const paymentMethods = [
  { name: "Card", value: "card" },
  { name: "Mobile Money", value: "mobilemoney" },
];

const getDomain = computed(() =>
  appVariant.value === "alexpay"
    ? "https://merchants.alexpay.com"
    : "https://merchant.redstonepgs.com",
);

const payload = ref({
  email: "",
  customer_first_name: "",
  customer_last_name: "",
  phone_number: "",
  method: "mobilemoney",
  operator: "",
  redirect_success_url: `${getDomain.value}/payment-links/success`,
  redirect_failed_url: `${getDomain.value}/payment-links/failed`,
  amount: "",
});

const onMethodChange = (method: string) => {
  payload.value.method = method;
  if (method === "card") {
    payload.value.operator = appVariant.value === "alexpay" ? "mpgs" : "tj";
  } else {
    payload.value.operator = "";
  }
};

const isActionReady = computed(() => {
  if (!payload.value.email || !payload.value.amount) return true;

  if (payload.value.method === "card") {
    return !(
      payload.value.redirect_success_url &&
      payload.value.redirect_failed_url &&
      payload.value.operator
    );
  }

  if (payload.value.method === "mobilemoney") {
    return !payload.value.phone_number;
  }

  return false;
});

const fetchPaymentLinkById = async () => {
  isLoading.value = true;

  const response = await processAPIRequest({
    action: fetchSinglePaymentLink,
    payload: { id: route.params.id },
    showAlert: false,
  });

  if (response && response.code === 200 && response.data) {
    payload.value.amount = response.data.amount || "";
      localStorage.setItem("paymentId", response.data.id)
  }

  isLoading.value = false;
};

onMounted(() => fetchPaymentLinkById());

const handlePayment = async () => {
  const paymentLinkId = route.params.id;

  const response = await processAPIRequest({
    action: payViaPaymentLink,
    payload: {
      id: paymentLinkId,
      data: payload.value,
    },
    btnRef: payBtnRef,
    btnText: "Pay Now",

    alertHandler: {
      200: {
        message: "Payment initiated successfully",
        description: "You are being redirected to the checkout page",
        type: "success",
      },
      400: {
        message: "Unable to make payment",
        description: "One off payment link already used.",
        type: "error",
      },
    },
  });
  if (response && response.code === 200 && response.data) {
    setTimeout(() => {
      createAndClickAnchor(response.data.data.payment_link, "_blank");
    }, 1200);
  } else {
    pushToastAlert({
      message: "Payment initialization failed",
      description: "Something went wrong, try again",
      type: "error",
    });
  }
  isLoading.value = false;
};

</script>
