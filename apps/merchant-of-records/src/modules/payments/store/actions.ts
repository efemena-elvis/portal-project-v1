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

export const getCustomers = async (payload: any) => {
  return await $api.fetch(`${paymentRoutes.getCustomers}?page=${payload.page}`);
};

export const getTransactions = async (payload: any) => {
  return await $api.fetch(`${paymentRoutes.getPaymentTransactions}?page=${payload.page}`);
};

export const getAllTransactions = async () => {
  return await $api.fetch(`${paymentRoutes.getPaymentTransactions}?limit=100000`);
};

export const getMerchants = async () => {
  return await $api.fetch(paymentRoutes.getMerchants);
};

export const initiatePayout = async (payload: any) => {
  return await $api.push(paymentRoutes.initiatePayout, payload);
};


export const getRefunds = async (payload: any) => {
  return await $api.fetch(`${paymentRoutes.getAllRefunds}?page=${payload.page}`);
};

export const fetchAllRefunds = async () => {
  return await $api.fetch(`${paymentRoutes.getAllRefunds}?limit=100000`);
};