import { useServiceAPI } from "@packages/hooks";
import { MobileMoneyPaymentRequest, PaymentDetails } from "../types";

const xAPIKey = "pJKIVaynqNfHzBblM0fG7Wzkz7nrE7q2CJDkPZL1";

const $getTransactionAPI = new useServiceAPI({
  API_BASE_URL: "https://get-transaction.staging.core.vesicash.com",
  HEADERS: {
    "x-api-key": xAPIKey,
  },
});

const $makePaymentAPI = new useServiceAPI({
  API_BASE_URL: "https://complete-pay.staging.core.vesicash.com",
  HEADERS: {
    "x-api-key": xAPIKey,
  },
});

export const fetchPaymentDetails = async (reference: string) => {
  return await $getTransactionAPI.push<PaymentDetails>("", {
    reference,
  });
};

export const makeMobileMoneyPayment = async (
  payload: MobileMoneyPaymentRequest
) => {
  return await $makePaymentAPI.push<string>("", payload);
};
