import { useServiceAPI } from "@packages/hooks";
import constants from "@/shared/utilities/constants";
import { externalRoutes } from "./external-routes";

const { MOR_API_BASE_URL, MOR_API_VERSION, MOR_AUTH_TOKEN } = constants;

const $api = new useServiceAPI({
  API_BASE_URL: MOR_API_BASE_URL,
  API_VERSION: MOR_API_VERSION,
  TOKEN_KEY: MOR_AUTH_TOKEN,
});

export const submitQuestionnaire = async (payload: any) => {
  return await $api.push(externalRoutes.submitQuestionnaire, payload);
};
