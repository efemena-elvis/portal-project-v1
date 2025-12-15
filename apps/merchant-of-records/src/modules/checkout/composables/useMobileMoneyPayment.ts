import { ref, computed, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useEvents } from "@packages/hooks";
import { useCheckoutStore } from "../store";
import { MobileMoneyPaymentRequest } from "../types";

// --- Constants ---
const POLLING_INTERVAL = 5 * 1000;
const POLLING_DURATION = 5 * 60000;

export const useMobileMoneyPayment = () => {
  const store = useCheckoutStore();
  const route = useRoute();
  const router = useRouter();
  const { processAPIRequest } = useEvents();

  // --- Internal State ---
  let pollingIntervalId: number | undefined;
  let pollingTimeoutId: number | undefined;

  const paymentButtonRef = ref<HTMLButtonElement | null>(null);
  const isPolling = ref(false);

  // --- Computed Getters ---
  const paymentDetails = computed(() => store.payment_details);
  const isFetchingDetails = computed(() => store.fetching_payment_details);
  const isInitiatingPayment = computed(() => store.initiating_payment);

  /**
   * @description Reactive getter for the payment reference from the current route's query params.
   */
  const getPaymentReference = computed(
    () => (route.params.reference as string) || route.query.reference || ""
  );

  // --- Helper Methods ---
  const getCheckoutStatusPath = (redirectUrl: string): string => {
    return `/checkout/payment-status?reference=${
      getPaymentReference.value
    }&status=pending&redirect_url=${encodeURIComponent(redirectUrl)}`;
  };

  // --- Core Methods ---
  const fetchPaymentDetails = async (showAlert = true) => {
    store.updateFetchingPaymentDetails(true);

    const response = await processAPIRequest({
      action: store.fetchPaymentDetails,
      payload: getPaymentReference.value,
      showAlert,
    });

    store.updateFetchingPaymentDetails(false);

    if (response && response?.data) store.updatePaymentDetails(response.data);
    return response;
  };

  const makePayment = async (
    requestPayload: MobileMoneyPaymentRequest,
    redirectUrl: string
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

      if (response && (response?.code === 200 || response?.code === 201)) {
        router.push(getCheckoutStatusPath(redirectUrl));
        return true;
      }
    } catch (error) {
      console.error("Payment initiation failed:", error);
    } finally {
      store.updatingInitiatingPayment(false);
    }
    // If we reach here, it means the initiation failed.
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
      console.log("polling 1...");
      const response = await fetchPaymentDetails(false);
      console.log("polling 2...");
      const status = response && response?.data?.status?.toLowerCase();

      if (
        status === "success" ||
        status === "successful" ||
        status === "failed"
      ) {
        stopPaymentPolling();
        updateRouteStatus(status.includes("success") ? "success" : "failed");
      }
    };

    await poll();

    pollingIntervalId = setInterval(
      poll,
      POLLING_INTERVAL
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

  // --- Exposed API ---
  return {
    // Computed Getters
    paymentDetails,
    isFetchingDetails,
    isInitiatingPayment,
    isPolling,
    getPaymentReference,

    // Methods
    fetchPaymentDetails,
    makePayment,
    startPaymentPolling,
    stopPaymentPolling,
    resetPaymentState,

    // Refs
    paymentButtonRef,
  };
};
