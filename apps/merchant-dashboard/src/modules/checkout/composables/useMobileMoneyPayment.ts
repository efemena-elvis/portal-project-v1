import { useEvents } from "@packages/hooks";
import { useCheckoutStore } from "../store";
import { MobileMoneyPaymentRequest } from "../types";
import { ref } from "vue";

export const useMobileMoneyPayment = () => {
  let pollingIntervalId: number | undefined = undefined;
  let pollingTimeoutId: number | undefined = undefined;
  const POLLING_INTERVAL = 5000; // every 5 seconds
  const POLLING_DURATION = 60000 * 5; // 5 minutes
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
    request: MobileMoneyPaymentRequest
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
      if (response && response.data?.status === "failed")
        stopPaymentStatusPolling();
      if (
        response &&
        (response.data?.status === "success" ||
          response.data?.status === "successful")
      ) {
        stopPaymentStatusPolling();
        setTimeout(() => {
          location.href = response.data?.redirect_url ?? "/";
        }, 2500);
      }
    };
    poll();
    pollingIntervalId = setInterval(
      poll,
      POLLING_INTERVAL
    ) as unknown as number;

    pollingTimeoutId = setTimeout(() => {
      stopPaymentStatusPolling();
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
