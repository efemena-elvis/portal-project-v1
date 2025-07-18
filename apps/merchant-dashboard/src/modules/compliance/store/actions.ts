import { useServiceAPI } from "@packages/hooks";
import { complianceRoutes } from "./compliance-routes";
import constants from "@/shared/utilities/constants";

const { APP_API_BASE_URL, APP_API_VERSION, APP_AUTH_TOKEN } = constants;

const $api = new useServiceAPI({
  API_BASE_URL: APP_API_BASE_URL,
  API_VERSION: APP_API_VERSION,
  TOKEN_KEY: APP_AUTH_TOKEN,
});

export const getCompliance = async () => {
  return await $api.fetch(complianceRoutes.getCompliance);
};

export const uploadCompliance = async (payload: any) => {
  return await $api.push(complianceRoutes.uploadCompliance, payload);
};

export const activateBusiness = async (payload: any) => {
  return await $api.push(
    `${complianceRoutes.activateBusiness}/${payload.complianceId}`
  );
};
