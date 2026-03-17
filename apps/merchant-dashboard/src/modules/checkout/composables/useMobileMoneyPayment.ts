import { useEvents } from "@packages/hooks";
import { useCheckoutStore } from "../store";
import { MobileMoneyPaymentRequest } from "../types";
import { ref } from "vue";

export const useMobileMoneyPayment = () => {
  let pollingIntervalId: number | undefined = undefined;
  let pollingTimeoutId: number | undefined = undefined;
  const POLLING_INTERVAL = 35 * 1000; // every 35 seconds (each call seems to take about 30 seconds to respond)
  const POLLING_DURATION = 60000 * 7; // 7 minutes
  const paymentButtonRef = ref(null);

  const store = useCheckoutStore();
  const {
    fetchPaymentDetails: fetchPayment,
    makeMobileMoneyPayment,
    updateFetchingPaymentDetails,
    updatePaymentDetails,
    updatePaymentStatus,
    updatingInitiatingPayment,
  } = store;

  const { processAPIRequest } = useEvents();

  const fetchPaymentDetails = async (reference: string, showAlert = true) => {
    updateFetchingPaymentDetails(true);
    const paymentDetailsResponse = await processAPIRequest({
      action: fetchPayment,
      payload: reference,
      showAlert,
    });
    updateFetchingPaymentDetails(false);
    if (paymentDetailsResponse && paymentDetailsResponse.data)
      updatePaymentDetails(paymentDetailsResponse.data);
    return paymentDetailsResponse;
  };

  const makePayment = async (
    reference: string,
    request: MobileMoneyPaymentRequest,
  ) => {
    updatingInitiatingPayment(true);
    const response = await processAPIRequest({
      action: makeMobileMoneyPayment,
      payload: {
        reference,
        request,
      },
      showAlert: true,
      btnRef: paymentButtonRef,
      btnText: "Pay",
      alertHandler: {
        201: {
          message: "Processing Payment",
          description: "Your payment is being processed",
          type: "success",
        },

        200: {
          message: "Processing Payment",
          description: "Your payment is being processed",
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
    updatingInitiatingPayment(false);
    if (response && response.code === 200) {
      updatePaymentStatus("pending");
      pollPaymentStatus(reference);
    }
  };

  const stopPaymentStatusPolling = () => {
    clearInterval(pollingIntervalId);
    clearTimeout(pollingTimeoutId);
    pollingIntervalId = undefined;
    pollingTimeoutId = undefined;
  };

  const pollPaymentStatus = (reference: string) => {
    const poll = async () => {
      const response = await fetchPaymentDetails(reference, false);

      if (response && response.data?.status.toLowerCase() === "failed") {
        stopPaymentStatusPolling();
      }

      if (
        response &&
        (response.data?.status.toLowerCase() === "success" ||
          response.data?.status.toLowerCase() === "successful")
      ) {
        stopPaymentStatusPolling();

        setTimeout(() => {
          const redirectUrl = response.data?.redirect_url || "/";
          window.location.replace(redirectUrl);
        }, 2500);
      }
    };
    poll();
    pollingIntervalId = setInterval(
      poll,
      POLLING_INTERVAL,
    ) as unknown as number;

    pollingTimeoutId = setTimeout(() => {
      stopPaymentStatusPolling();
      updatePaymentStatus("failed");
    }, POLLING_DURATION) as unknown as number;
  };

  const reset = () => {
    updatePaymentStatus("idle");
    updatePaymentDetails(null);
  };

  return {
    store,
    fetchPaymentDetails,
    makePayment,
    paymentButtonRef,
    reset,
  };
};
