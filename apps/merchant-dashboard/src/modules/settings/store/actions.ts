import { useServiceAPI } from "@packages/hooks";
import { settingsRoutes } from "./settings-routes";
import constants from "@/shared/utilities/constants";
import { useSettingsMutations } from "./mutations";

const { APP_API_BASE_URL, APP_API_VERSION, APP_AUTH_TOKEN } = constants;
const { mutateProfile } = useSettingsMutations();

const $api = new useServiceAPI({
  API_BASE_URL: APP_API_BASE_URL,
  API_VERSION: APP_API_VERSION,
  TOKEN_KEY: APP_AUTH_TOKEN,
});

export const fetchUserProfile = async () => {
  const response = await $api.fetch(settingsRoutes.userProfile);
  mutateProfile(response);
  return response;
};

export const updateUserProfile = async (payload: any) => {
  return await $api.push(settingsRoutes.userProfile, payload);
};

export const updateUserPassword = async (payload: any) => {
  return await $api.push(settingsRoutes.userPassword, payload);
};
