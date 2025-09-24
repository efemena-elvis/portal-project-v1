import { useProfile, useServiceAPI } from "@packages/hooks";
import { checkoutRoutes } from "./checkout-routes";
import constants from "@/shared/utilities/constants";
import { useAuthStore } from "@/modules/auth/store";
import { computed } from "vue";
import { MobileMoneyPaymentRequest, PaymentDetails } from "../types";

const { MOR_API_BASE_URL, MOR_API_VERSION, MOR_AUTH_TOKEN } = constants;

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

export const fetchPaymentDetails = async (reference: string) => {
  return await $api.fetch<PaymentDetails>(
    checkoutRoutes.payment_details(reference)
  );
};

export const makeMobileMoneyPayment = async ({
  reference,
  request,
}: {
  reference: string;
  request: MobileMoneyPaymentRequest;
}) => {
  return await $api.push<string>(
    checkoutRoutes.make_momo_payment(reference),
    request
  );
};
