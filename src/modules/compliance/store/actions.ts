import { useServiceAPI } from "@packages/hooks";
import { complianceRoutes } from "./compliance-routes";
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

export const uploadCompliance = async (payload: any) => {
  return await $api.push(complianceRoutes.uploadCompliance, payload);
};

export const activateBusiness = async (payload: any) => {
  return await $api.push(
    `${complianceRoutes.activateBusiness}/${payload.complianceId}`,
  );
};

export const getMerchantOnDraft = async () => {
  return await $api.fetch(complianceRoutes.getDraftedMerchants);
};

export const onboardBulkMerchant = async (payload: any) => {
  return await $api.push(complianceRoutes.onboardBulkMerchants, payload);
};

export const activateBulkMerchants = async () => {
  return await $api.push(complianceRoutes.activateBulkMerchants, {});
};
