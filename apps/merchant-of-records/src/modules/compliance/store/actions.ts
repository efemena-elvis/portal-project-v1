import { useServiceAPI } from "@packages/hooks";
import { complianceRoutes } from "./compliance-routes";
import constants from "@/shared/utilities/constants";

const { MOR_API_BASE_URL, MOR_API_VERSION, MOR_AUTH_TOKEN } = constants;

const $api = new useServiceAPI({
  API_BASE_URL: MOR_API_BASE_URL,
  API_VERSION: MOR_API_VERSION,
  TOKEN_KEY: MOR_AUTH_TOKEN,
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
