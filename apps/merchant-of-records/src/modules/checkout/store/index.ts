import { ref } from "vue";
import { defineStore } from "pinia";
import * as actions from "./actions";
import { PaymentDetails, PaymentStatus } from "../types";

export const useCheckoutStore = defineStore("checkout", () => {
  const fetching_payment_details = ref(false);
  const payment_status = ref<PaymentStatus | "idle">("idle");
  const payment_details = ref<PaymentDetails | null>(null);
  const initiating_payment = ref(false);

  const updatePaymentDetails = (details: PaymentDetails | null) => {
    payment_details.value = details;
  };

  const updatingInitiatingPayment = (state: boolean) => {
    initiating_payment.value = state;
  };

  const updateFetchingPaymentDetails = (state: boolean) => {
    fetching_payment_details.value = state;
  };

  const updatePaymentStatus = (status: PaymentStatus | "idle") => {
    payment_status.value = status;
  };

  return {
    ...actions,
    fetching_payment_details,
    payment_details,
    initiating_payment,
    payment_status,
    updatingInitiatingPayment,
    updateFetchingPaymentDetails,
    updatePaymentStatus,
    updatePaymentDetails,
  };
});
