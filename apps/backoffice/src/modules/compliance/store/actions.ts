import { useServiceAPI } from "@packages/hooks";
import { complianceRoutes } from "./compliance-routes";
import { complianceData } from "./state";
import constants from "@/shared/utilities/constants";

const { PORTAL_API_BASE_URL, PORTAL_API_VERSION, PORTAL_AUTH_TOKEN } =
  constants;

const $api = new useServiceAPI({
  API_BASE_URL: PORTAL_API_BASE_URL,
  API_VERSION: PORTAL_API_VERSION,
  TOKEN_KEY: PORTAL_AUTH_TOKEN,
});

export const getCompliance = async () => {
  return await $api.fetch(complianceRoutes.getCompliance);
};

export const mutateCompliance = (payload: any) => {
  complianceData.value = payload;
};

export const getCompliances = getCompliance;

export const getMerchantOnDraft = (id: any) => {
  return null;
};

export const transformCleanedMerchantData = (data: any) => {
  return data;
};

export const bulkUpdateMerchantData = (data: any) => {
  return data;
};

export const addMerchantData = (data: any) => {
  return data;
};

export const uploadCompliance = async (payload: any) => {
  return await $api.push(complianceRoutes.uploadCompliance, payload);
};
