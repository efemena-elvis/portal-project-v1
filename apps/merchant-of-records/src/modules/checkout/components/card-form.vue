<template>
  <form @submit="handleSubmission" v-if="customerForm">
    <TextFieldInput
      :labelId="'card_number'"
      :labelTitle="'Card Number'"
      :labelCompact="false"
      :inputType="IInputType.Number"
      :inputPlaceholder="'0000 0000 0000 0000'"
      isRequired
      :errorHandler="{
        validator: 'validateRequired',
        message: 'Card number is a required field',
      }"
    />
    <div class="grid grid-cols-2 sm:grid-cols-1 gap-2">
      <SelectFieldInput
        labelId="expiry_month"
        labelTitle="Expiry Month"
        :labelCompact="false"
        inputPlaceholder="Select month"
        :selectData="monthOptions"
        isRequired
        name="month"
      />
      <SelectFieldInput
        labelId="expiry_year"
        labelTitle="Expiry Year"
        :labelCompact="false"
        inputPlaceholder="Select year"
        :selectData="yearOptions"
        isRequired
        name="year"
      />
    </div>

    <TextFieldInput
      :labelId="'card_cvv'"
      :labelTitle="'Security Code (CVV)'"
      :labelCompact="false"
      :inputType="IInputType.Password"
      :inputPlaceholder="'123'"
      isRequired
      :errorHandler="{
        validator: 'validateRequired',
        message: 'CVV is a required field',
      }"
    />
    <button
      class="btn btn-primary w-full btn-sm !font-bold"
      ref="paymentButtonRef"
      type="submit"
    >
      Pay {{ store.payment_details?.currency ?? "" }}
      {{ store.payment_details?.amount.toFixed(2) ?? "" }}
    </button>
  </form>
  <form @submit.prevent="handleCustomerDetailsCollection" v-else>
    <div class="grid grid-cols-2 sm:grid-cols-1 gap-2">
      <TextFieldInput
        :labelId="'customer_first_name'"
        :labelTitle="'First Name'"
        :labelCompact="false"
        :inputType="IInputType.Text"
        :inputPlaceholder="'Enter First Name'"
        isRequired
        :inputValue="store?.payment_details?.customer_first_name ?? ''"
      />
      <TextFieldInput
        :labelId="'customer_last_name'"
        :labelTitle="'Last Name'"
        :labelCompact="false"
        :inputType="IInputType.Text"
        :inputPlaceholder="'Enter Last Name'"
        isRequired
        :inputValue="store?.payment_details?.customer_last_name ?? ''"
      />
    </div>
    <TextFieldInput
      :labelId="'email'"
      :labelTitle="'Email'"
      :labelCompact="false"
      :inputType="IInputType.Email"
      :inputPlaceholder="'Enter Email'"
      :inputValue="store?.payment_details?.email ?? ''"
      isRequired
    />

    <button class="btn btn-primary w-full btn-sm" type="submit">
      Continue
    </button>
  </form>
</template>

<script lang="ts" setup>
import { IInputType } from "@packages/models";
import SelectFieldInput from "@packages/uikit/src/components/form-comps/select-field-input.vue";
import TextFieldInput from "@packages/uikit/src/components/form-comps/text-field-input.vue";
import {
  generateBrowserChecks,
  perform3DSMethod,
  start3DSChallenge,
} from "@/shared/utilities/mpgs";
import { useCheckoutStore } from "../store";
import { useEvents } from "@packages/hooks";
import { ref } from "vue";
import { CardGTIPaymentRequest } from "../types";

const store = useCheckoutStore();
const { makeCardPayment, makeGtiCardPayment } = store;
const customerForm = ref<{
  customer_first_name: string;
  customer_last_name: string;
  email: string;
  phone_number: string;
} | null>(null);

const { processAPIRequest, clickHandler } = useEvents();
const {
  customer_details,
  reference,
  redirect_url = "",
  currency = "",
} = defineProps<{
  customer_details: {
    phone_number?: string;
    email: string;
    customer_first_name: string;
    customer_last_name: string;
  };
  reference: string;
  redirect_url?: string;
  currency?: string;
}>();

const monthOptions = [
  { value: "01", name: "January" },
  { value: "02", name: "February" },
  { value: "03", name: "March" },
  { value: "04", name: "April" },
  { value: "05", name: "May" },
  { value: "06", name: "June" },
  { value: "07", name: "July" },
  { value: "08", name: "August" },
  { value: "09", name: "September" },
  { value: "10", name: "October" },
  { value: "11", name: "November" },
  { value: "12", name: "December" },
];

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 12 }, (_, i) => {
  const year = currentYear + i;
  const yearString = year.toString().slice(-2);
  return { value: yearString, name: year.toString() };
});

const paymentButtonRef = ref(null);

const handleCustomerDetailsCollection = (event: Event) => {
  event.preventDefault();
  const form = event.target as HTMLFormElement;
  const formData = new FormData(form);
  const formValues = Object.fromEntries(formData.entries()) as {
    customer_first_name: string;
    customer_last_name: string;
    email: string;
    phone_number: string;
  };
  customerForm.value = {
    ...formValues,
    // phone_number: customer_details.phone_number || "0000000000",
  };
};

const handleSubmission = async (event: Event) => {
  event.preventDefault();
  const form = event.target as HTMLFormElement;
  const formData = new FormData(form);
  const formValues = Object.fromEntries(formData.entries()) as {
    card_number: string;
    expiry_month: string;
    expiry_year: string;
    card_cvv: string;
  };
  const extras =
    store.payment_details?.method === "mobilemoney"
      ? {
          operator: "mpgs",
          method: "card",
          redirect_failed_url: `${store.payment_details.redirect_url}?status=failed`,
          redirect_success_url: `${store.payment_details.redirect_url}?status=success`,
          redirect_url: store.payment_details.redirect_url,
        }
      : {};
  const browerChecks = generateBrowserChecks();
  const request = {
    ...(customerForm.value
      ? {
          ...customerForm.value,
        }
      : {
          ...customer_details,
        }),
    card_number: formValues.card_number,
    card_expiry_date: `${formValues.expiry_month}${formValues.expiry_year}`,
    card_cvv: formValues.card_cvv,
    ...browerChecks,
    ...extras,
  };

  // "billing_address_line1": "123 Business Way",
  // "billing_city": "Lagos",
  // "billing_province": "Lagos",
  // "billing_postal_code": "100001",
  // "billing_country": "NG",
  // "redirect_url": "https://google.com"
  //  "card_number": "5123450000000008",
  //     "card_cvv": "171",
  //     "card_expiry_date": "1226",

  const cardGtiRequest: CardGTIPaymentRequest = {
    billing_address_line1: "123 Business Way",
    billing_city: "Lagos",
    billing_country: "NG",
    billing_postal_code: "100001",
    billing_province: "Lagos",
    card_cvv: formValues.card_cvv,
    card_expiry_date: `${formValues.expiry_month}${formValues.expiry_year.slice(-2)}`,
    card_number: formValues.card_number,
    customer_first_name: customerForm.value?.customer_first_name ?? "",
    customer_last_name: customerForm.value?.customer_last_name ?? "",
    email: customerForm.value?.email ?? "",
    phone_number: customerForm.value?.phone_number ?? "",
    redirect_url,
  };

  if (["USD"].includes(currency)) {
    const response = await processAPIRequest({
      action: makeGtiCardPayment,
      payload: {
        reference,
        request: cardGtiRequest,
      },
      showAlert: true,
      btnRef: paymentButtonRef,
      btnText: "Pay",
      alertHandler: {
        201: {
          message: "3DS Challenge Required",
          description: "You need to complete a 3DS Challenge",
          type: "success",
        },

        200: {
          message: "3DS Challenge Required",
          description: "You need to complete a 3DS Challenge",
          type: "success",
        },

        400: {
          message: "Payment Failed",
          type: "error",
        },
        500: {
          message: "Something went wrong",
          type: "error",
        },
      },
    });
    console.log({ response });
    if (response) {
      location.href = response.data?.redirect_url ?? "/";
    }
    return;
  }

  const response = await processAPIRequest({
    action: makeCardPayment,
    payload: {
      reference,
      request,
    },
    showAlert: true,
    btnRef: paymentButtonRef,
    btnText: "Pay",
    alertHandler: {
      201: {
        message: "3DS Challenge Required",
        description: "You need to complete a 3DS Challenge",
        type: "success",
      },

      200: {
        message: "3DS Challenge Required",
        description: "You need to complete a 3DS Challenge",
        type: "success",
      },

      400: {
        message: "Payment Failed",
        type: "error",
      },
      500: {
        message: "Something went wrong",
        type: "error",
      },
    },
  });

  if ([200, 201].includes(response && response.code ? response.code : 0)) {
    clickHandler(paymentButtonRef);
    const device_storage_token = response
      ? response.data?.device_storage_token
      : null;

    if (device_storage_token) {
      const { methodPostData, methodUrl } = device_storage_token;
      perform3DSMethod(methodUrl, methodPostData);
      await new Promise((res) => {
        setTimeout(() => {
          res("ready");
        }, 2500);
      });
      const challenge_response = await makeCardPayment({ reference, request });
      clickHandler(paymentButtonRef, "Pay", false);
      const challenge_details = challenge_response.data?.device_storage_token;
      if (challenge_details) {
        const {
          customizedHtml: {
            "3ds2": { acsUrl, cReq },
          },
        } = challenge_details;
        start3DSChallenge(acsUrl, cReq);
      }
    } else {
      clickHandler(paymentButtonRef, "Pay", false);
    }
  }
};
</script>
