import { useServiceAPI } from "@packages/hooks";
import { paymentRoutes } from "./payment-routes";
import constants from "@/shared/utilities/constants";
import { useProfile } from "@packages/hooks";
import { useAuthStore } from "@/modules/auth/store";
import { computed } from "vue";

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

export const getTransactions = async () => {
  return await $api.fetch(paymentRoutes.getPaymentTransactions);
};

export const getBalanceHistory = async () => {
  return await $api.fetch(paymentRoutes.getBalanceHistory);
};

export const initiateSettlement = async (payload: any) => {
  return await $api.push(paymentRoutes.initiateSettlement);
};

export const fetchAllSettlements = async () => {
  return await $api.fetch(paymentRoutes.getAllSettlements);
};
