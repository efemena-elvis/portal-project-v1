import constants from "@/shared/utilities/constants";
import { useServiceAPI } from "@packages/hooks";
import { merchantRoutes } from "./merchant-routes";

const { PORTAL_API_BASE_URL, PORTAL_API_VERSION, PORTAL_AUTH_TOKEN } =
  constants;

const $api = new useServiceAPI({
  API_BASE_URL: PORTAL_API_BASE_URL,
  API_VERSION: PORTAL_API_VERSION,
  TOKEN_KEY: PORTAL_AUTH_TOKEN,
});

export const getMerchants = async (payload: any) => {
  return await $api.fetch(
    `${merchantRoutes.getMerchants}${payload.filters ? payload.filters : `?page=${payload.page}`}`,
  );
};

export const getSingleMerchant = async (id: string) => {
  return await $api.fetch(`${merchantRoutes.getSingleMerchant}/${id}`);
};

export const resetMerchantPassword = async (id: string) => {
  return await $api.push(
    `${merchantRoutes.resetMerchantPassword}/${id}/reset-password`,
  );
};

export const loginMerchantAccount = async (id: string) => {
  return await $api.push(`${merchantRoutes.loginMerchantAccount}/${id}/login`);
};

export const deleteMerchant = async (id: string) => {
  return await $api.delete(`${merchantRoutes.deleteMerchant}/${id}`);
};

export const approveMerchantPayoutRequest = async (id: string) => {
  return await $api.push(
    `${merchantRoutes.approveMerchantPayoutRequest}/${id}/payout-request/approve`,
  );
};

export const rejectMerchantPayoutRequest = async (id: string) => {
  return await $api.push(
    `${merchantRoutes.rejectMerchantPayoutRequest}/${id}/payout-request/reject`,
  );
};

export const resetMerchantMfa = async (userId: string) => {
  return await $api.push(merchantRoutes.resetMfa, { user_id: userId });
};
