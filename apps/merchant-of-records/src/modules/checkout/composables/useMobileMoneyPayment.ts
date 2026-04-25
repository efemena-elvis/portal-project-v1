import { ref, computed, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useEvents } from "@packages/hooks";
import { useCheckoutStore } from "../store";
import { MobileMoneyPaymentRequest } from "../types";

const POLLING_INTERVAL = 5 * 1000;
const POLLING_DURATION = 5 * 60000;

export const useMobileMoneyPayment = () => {
  const store = useCheckoutStore();
  const route = useRoute();
  const router = useRouter();
  const { processAPIRequest } = useEvents();

  const appendQueryParam = (url: string, key: string, value: string) => {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}${key}=${encodeURIComponent(value)}`;
  };

  const getCheckoutStatusPath = (redirectUrl: string) => {
    return `/checkout/payment-status?reference=${
      getPaymentReference.value
    }&status=pending&redirect_url=${encodeURIComponent(redirectUrl)}`;
  };

  let pollingIntervalId: number | undefined;
  let pollingTimeoutId: number | undefined;

  const paymentButtonRef = ref<HTMLButtonElement | null>(null);
  const isPolling = ref(false);

  const paymentDetails = computed(() => store.payment_details);
  const isFetchingDetails = computed(() => store.fetching_payment_details);
  const isInitiatingPayment = computed(() => store.initiating_payment);

  const getPaymentReference = computed(
    () => (route.params.reference as string) || route.query.reference || "",
  );

  const fetchPaymentDetails = async (showAlert = true) => {
    store.updateFetchingPaymentDetails(true);

    const response = await processAPIRequest({
      action: store.fetchPaymentDetails,
      payload: getPaymentReference.value,
      showAlert,
    });

    store.updateFetchingPaymentDetails(false);

    if (response && response.data) {
      store.updatePaymentDetails(response.data);
    }

    return response;
  };

  const makePayment = async (
    requestPayload: MobileMoneyPaymentRequest,
    redirectUrl: string,
  ): Promise<boolean> => {
    store.updatingInitiatingPayment(true);

    try {
      const response = await processAPIRequest({
        action: store.makeMobileMoneyPayment,
        payload: requestPayload,
        showAlert: true,
        btnRef: paymentButtonRef,
        btnText: "Pay",
        alertHandler: {
          200: { message: "Processing Payment", type: "success" },
          201: { message: "Processing Payment", type: "success" },
          400: { message: "Payment Failed", type: "error" },
          409: { message: "Payment already initiated", type: "error" },
          500: { message: "An unexpected error occurred", type: "error" },
        },
      });

      if (response && (response.code === 200 || response.code === 201)) {
        router.push(getCheckoutStatusPath(redirectUrl));
        return true;
      }
    } catch (error) {
      console.error("Payment initiation failed:", error);
    } finally {
      store.updatingInitiatingPayment(false);
    }

    return false;
  };

  const stopPaymentPolling = () => {
    clearInterval(pollingIntervalId);
    clearTimeout(pollingTimeoutId);
    pollingIntervalId = undefined;
    pollingTimeoutId = undefined;
    isPolling.value = false;
  };

  const startPaymentPolling = async () => {
    if (isPolling.value || !getPaymentReference.value) return;
    isPolling.value = true;

    const updateRouteStatus = (status: "success" | "failed") => {
      router.replace({ query: { ...route.query, status } });
    };

    const poll = async () => {
      const response = await fetchPaymentDetails(false);

      if (!response || !response.data) return;

      const status = response.data.status?.toLowerCase();

      if (
        status === "success" ||
        status === "successful" ||
        status === "failed"
      ) {
        stopPaymentPolling();

        const isSuccess = status.includes("success");

        updateRouteStatus(isSuccess ? "success" : "failed");

            if (status === "failed") {
        const baseUrl =
          response.data.redirect_failed_url 

        const redirectUrl = appendQueryParam(
          baseUrl,
          "reference",
          String(getPaymentReference.value),
        );

        window.location.replace(redirectUrl);
        return;
      }

        if (status === "success" || status === "successful") {
          const baseUrl =
            response.data?.redirect_success_url ||
            response.data?.redirect_url ||
            "";

          const redirectUrl = appendQueryParam(
            baseUrl,
            "reference",
            String(getPaymentReference.value),
          );

          setTimeout(() => {
            window.location.replace(redirectUrl);
          }, 2000);
        }
      }
    };

    await poll();

    pollingIntervalId = setInterval(
      poll,
      POLLING_INTERVAL,
    ) as unknown as number;

    pollingTimeoutId = setTimeout(() => {
      if (isPolling.value) {
        stopPaymentPolling();
        updateRouteStatus("failed");
      }
    }, POLLING_DURATION) as unknown as number;
  };

  const resetPaymentState = () => {
    store.updatePaymentStatus("idle");
    store.updatePaymentDetails(null);
  };

  onUnmounted(stopPaymentPolling);

  return {
    paymentDetails,
    isFetchingDetails,
    isInitiatingPayment,
    isPolling,
    getPaymentReference,
    fetchPaymentDetails,
    makePayment,
    startPaymentPolling,
    stopPaymentPolling,
    resetPaymentState,
    paymentButtonRef,
  };
};
