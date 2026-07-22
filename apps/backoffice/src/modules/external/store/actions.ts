import { useServiceAPI } from "@packages/hooks";
import constants from "@/shared/utilities/constants";
import { externalRoutes } from "./external-routes";

const { PORTAL_API_BASE_URL, PORTAL_API_VERSION, PORTAL_AUTH_TOKEN } =
  constants;

const $api = new useServiceAPI({
  API_BASE_URL: PORTAL_API_BASE_URL,
  API_VERSION: PORTAL_API_VERSION,
  TOKEN_KEY: PORTAL_AUTH_TOKEN,
});

export const submitQuestionnaire = async (payload: any) => {
  return await $api.push(externalRoutes.submitQuestionnaire, payload);
};
