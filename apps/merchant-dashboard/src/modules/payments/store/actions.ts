import { useServiceAPI } from "@packages/hooks";
import { paymentRoutes } from "./payment-routes";
import constants from "@/shared/utilities/constants";
import { useProfile } from "@packages/hooks";
import { useAuthStore } from "@/modules/auth/store";
import { computed } from "vue";
import axios from "axios";

const { APP_API_BASE_URL, APP_API_VERSION, APP_AUTH_TOKEN, PROD_BASE_URL } =
  constants;

const authStore = useAuthStore();
const profileUtil = new useProfile(authStore);

const getBusinessProfile = computed(() => profileUtil.getBusiness());
const activeMode = getBusinessProfile.value?.businessMode || "test";
const publicKey = computed(() =>
  activeMode === "test"
    ? profileUtil.getAPIKeys().test.public
    : profileUtil.getAPIKeys().live.public,
);

const secretKey = computed(() =>
  activeMode === "test"
    ? profileUtil.getAPIKeys().test.secret
    : profileUtil.getAPIKeys().live.secret,
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

const $paymentLinkAPI = new useServiceAPI({
  API_BASE_URL: PROD_BASE_URL,
  API_VERSION: "v1",
  TOKEN_KEY: APP_AUTH_TOKEN,
});

export const getSingleTransaction = async (payload: any) => {
  return await $api.fetch(
    `${paymentRoutes.getTransactionByRef}/${payload.ref}`,
  );
};

export const getTransactions = async (payload: any) => {
  return await $api.fetch(
    `${paymentRoutes.getPaymentTransactions}${payload.filters ? payload.filters : `?page=${payload.page}`}`,
  );
};

export const getAllTransactions = async () => {
  return await $api.fetch(
    `${paymentRoutes.getPaymentTransactions}?limit=100000`,
  );
};

export const getCustomers = async (payload: any) => {
  return await $api.fetch(
    `${paymentRoutes.getCustomers}${payload.filters ? payload.filters : `?page=${payload.page}`}`,
  );
};

export const getBanks = async (payload: any) => {
  return await $paymentLinkAPI.fetch(
    `${paymentRoutes.getBanks}?country=${payload.country}`,
  );
};

export const getRefunds = async (payload: any) => {
  return await $api.fetch(
    `${paymentRoutes.getAllRefunds}${payload.filters ? payload.filters : `?page=${payload.page}`}`,
  );
};

export const fetchAllRefunds = async () => {
  return await $api.fetch(`${paymentRoutes.getAllRefunds}?limit=100000`);
};

export const createPaymentLink = async (payload: any) => {
  return await $paymentLinkAPI.push(paymentRoutes.getPaymentLinks, payload);
};

export const fetchPaymentLinks = async (payload: any) => {
  return await $paymentLinkAPI.fetch(
    `${paymentRoutes.getPaymentLinks}${payload.filters ? payload.filters : `?page=${payload.page}`}&limit=10`,
  );
};

export const fetchSinglePaymentLink = async (payload: { id: string }) => {
  const response = await axios.get(
    `${PROD_BASE_URL}/v1/${paymentRoutes.getPaymentLinks}/details/${payload.id}`
  );

  return response.data;
};

export const updatePaymentLink = async (payload: any) => {
  return await $paymentLinkAPI.patch(
    `${paymentRoutes.getPaymentLinks}/${payload.id}`,
    payload,
  );
};

export const deletePaymentLink = async (payload: any) => {
  return await $paymentLinkAPI.delete(
    `${paymentRoutes.getPaymentLinks}/${payload.id}`,
  );
};

export const payViaPaymentLink = async (payload: any) => {
  const response = await axios.post(
    `${PROD_BASE_URL}/v1/${paymentRoutes.getPaymentLinks}/${payload.id}/pay`,
    payload.data,
    {
      validateStatus: () => true, // accept all status codes
    }
  );

  return {
    code: response.status, // maps status to the "code" processAPIRequest expects
    data: response.data,
    message: response.data?.message || response.statusText,
  };
};
