import { useProfile, useServiceAPI } from "@packages/hooks";
import {
  CardPaymentRequest,
  CardPaymentResponse,
  MobileMoneyPaymentRequest,
  PaymentDetails,
} from "../types";
import { checkoutRoutes } from "./checkout-routes";
import constants from "@/shared/utilities/constants";
import { useAuthStore } from "@/modules/auth/store";
import { computed } from "vue";

const { MOR_API_BASE_URL, MOR_API_VERSION, MOR_AUTH_TOKEN, ENVIRONMENT } =
  constants;
const authStore = useAuthStore();
const profileUtil = new useProfile(authStore);

const getBusinessProfile = computed(() => profileUtil.getBusiness());
const activeMode = getBusinessProfile.value?.businessMode || "test";
const publicKey = computed(() =>
  activeMode === "test"
    ? profileUtil.getAPIKeys().test.public
    : profileUtil.getAPIKeys().live.public
);
const secretKey = computed(() =>
  activeMode === "test"
    ? profileUtil.getAPIKeys().test.secret
    : profileUtil.getAPIKeys().live.secret
);

const $api = new useServiceAPI({
  API_BASE_URL: MOR_API_BASE_URL,
  API_VERSION: MOR_API_VERSION,
  TOKEN_KEY: MOR_AUTH_TOKEN,
  HEADERS: {
    "public-key": publicKey.value,
    "secret-key": secretKey.value,
  },
});

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

export const makeCardPayment = async ({
  reference,
  request,
}: {
  reference: string;
  request: CardPaymentRequest;
}) => {
  const ip_response = await fetchIpAddress();
  return await $api.push<CardPaymentResponse>(
    checkoutRoutes.make_card_payment(reference),
    {
      ...request,
      ip_address: ip_response.data?.ip_address,
    }
  );
};

export const fetchIpAddress = async () => {
  return await $api.fetch<{ ip_address: string }>(
    checkoutRoutes.fetch_ip_address
  );
};
