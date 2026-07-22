import constants from "@/shared/utilities/constants";
import { useServiceAPI } from "@packages/hooks";
import { feeRoutes } from "./fee-routes";

const { PORTAL_API_BASE_URL, PORTAL_API_VERSION, PORTAL_AUTH_TOKEN } =
  constants;

const $api = new useServiceAPI({
  API_BASE_URL: PORTAL_API_BASE_URL,
  API_VERSION: PORTAL_API_VERSION,
  TOKEN_KEY: PORTAL_AUTH_TOKEN,
});

export const getFees = async (payload: any) => {
  return await $api.fetch(
    `${feeRoutes.getFees}${payload.filters ? payload.filters : `?page=${payload.page}`}`,
  );
};

export const getSingleFee = async (payload: any) => {
  return await $api.fetch(
    `${feeRoutes.getSingleFee}/${payload.merchant_config_uuid}`,
  );
};

export const createFee = async (payload: any) => {
  return await $api.push(feeRoutes.createFee, payload);
};

export const updateFee = async (id: string, payload: any) => {
  return await $api.update(`${feeRoutes.updateFee}/${id}`, payload);
};

export const deleteFee = async (id: string) => {
  return await $api.delete(`${feeRoutes.deleteFee}/${id}`);
};
