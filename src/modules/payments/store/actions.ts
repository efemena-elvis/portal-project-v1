import { useServiceAPI, useProfile } from "@packages/hooks";
import { paymentRoutes } from "./payment-routes";
import constants from "@/shared/utilities/constants";

const { PORTAL_API_BASE_URL, PORTAL_API_VERSION, PORTAL_AUTH_TOKEN } =
  constants;

const $api = new useServiceAPI({
  API_BASE_URL: PORTAL_API_BASE_URL,
  API_VERSION: PORTAL_API_VERSION,
  TOKEN_KEY: PORTAL_AUTH_TOKEN,
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

export const initiatePayout = async (payload: any) => {
  return await $api.push(paymentRoutes.initiatePayout, payload);
};
