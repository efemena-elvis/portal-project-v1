import { useEvents } from "@packages/hooks";
import { useCheckoutStore } from "../store";
import { MobileMoneyPaymentRequest } from "../types";
import { ref } from "vue";

export const useMobileMoneyPayment = () => {
  let pollingIntervalId: number | undefined;
  let pollingTimeoutId: number | undefined;

  const POLLING_INTERVAL = 15 * 1000;
  const POLLING_DURATION = 60000 * 7;

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

  const fetchPaymentDetails = async (
    reference: string,
    showAlert = true,
  ) => {
    updateFetchingPaymentDetails(true);

    const paymentDetailsResponse = await processAPIRequest({
      action: fetchPayment,
      payload: reference,
      showAlert,
    });

    updateFetchingPaymentDetails(false);

    if (paymentDetailsResponse?.data) {
      updatePaymentDetails(paymentDetailsResponse.data);
    }

    return paymentDetailsResponse;
  };

  const makePayment = async (
    reference: string,
    request: MobileMoneyPaymentRequest,
  ) => {
    updatingInitiatingPayment(true);

    const response = await processAPIRequest({
      action: makeMobileMoneyPayment,
      payload: { reference, request },
      showAlert: true,
      btnRef: paymentButtonRef,
      btnText: "Pay",
      alertHandler: {
        201: { message: "Processing Payment", type: "success" },
        200: { message: "Processing Payment", type: "success" },
        400: { message: "Payment Failed", type: "error" },
        500: { message: "Something went wrong", type: "error" },
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

      const status = response?.data?.status?.toLowerCase();

      if (!status) return;

      if (status === "failed") {
        stopPaymentStatusPolling();

        const baseUrl =
          response.data?.redirect_failed_url ||
          response.data?.redirect_url ||
          "/";

        const url = new URL(baseUrl, window.location.origin);
        url.searchParams.set("reference", String(reference));

        window.location.replace(url.toString());
        return;
      }

      if (status === "success" || status === "successful") {
        stopPaymentStatusPolling();

        const baseUrl =
          response.data?.redirect_success_url ||
          response.data?.redirect_url ||
          "/";

        const url = new URL(baseUrl, window.location.origin);
        url.searchParams.set("reference", String(reference));

        setTimeout(() => {
          window.location.replace(url.toString());
        }, 2500);
      }
    };

    poll();

    pollingIntervalId = setInterval(poll, POLLING_INTERVAL) as unknown as number;

    pollingTimeoutId = setTimeout(() => {
      stopPaymentStatusPolling();
      updatePaymentStatus("failed");

      const url = new URL("/", window.location.origin);
      url.searchParams.set("reference", String(reference));

      window.location.replace(url.toString());
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