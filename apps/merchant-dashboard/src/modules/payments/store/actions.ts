import { useServiceAPI } from "@packages/hooks";
import { paymentRoutes } from "./payment-routes";
import constants from "@/shared/utilities/constants";
import { useProfile } from "@packages/hooks";
import { useAuthStore } from "@/modules/auth/store";
import { computed } from "vue";

const { APP_API_BASE_URL, APP_API_VERSION, APP_AUTH_TOKEN, PROD_BASE_URL } =
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
  API_BASE_URL: APP_API_BASE_URL,
  API_VERSION: APP_API_VERSION,
  TOKEN_KEY: APP_AUTH_TOKEN,
  HEADERS: {
    "public-key": publicKey.value,
    "secret-key": secretKey.value,
  },
});

export const getSingleTransaction = async (payload: any) => {
  return await $api.fetch(`${paymentRoutes.getTransactionByRef}/${payload.ref}`)
};


export const getTransactions = async (payload: any) => {
  return await $api.fetch(
    `${paymentRoutes.getPaymentTransactions}${payload.filters ? payload.filters : `?page=${payload.page}`}`
  );
};

export const getAllTransactions = async () => {
  return await $api.fetch(
    `${paymentRoutes.getPaymentTransactions}?limit=100000`
  );
};

export const getCustomers = async (payload: any) => {
  return await $api.fetch(`${paymentRoutes.getCustomers}${payload.filters ? payload.filters : `?page=${payload.page}`}`);
};

export const getBanks = async (payload: any) => {
  const url = `${PROD_BASE_URL}/v1/${paymentRoutes.getBanks}?country=${payload.country}`;
  return await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${APP_AUTH_TOKEN}`,
    },
  });
};

export const getRefunds = async (payload: any) => {
  return await $api.fetch(
    `${paymentRoutes.getAllRefunds}${payload.filters ? payload.filters : `?page=${payload.page}`}`
  );
};

export const fetchAllRefunds = async () => {
  return await $api.fetch(`${paymentRoutes.getAllRefunds}?limit=100000`);
};
