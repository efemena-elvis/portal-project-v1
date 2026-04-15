import { useServiceAPI, useProfile } from "@packages/hooks";
import { settingsRoutes } from "./settings-routes";
import constants from "@/shared/utilities/constants";
import { useSettingsMutations } from "./mutations";
import { useAuthStore } from "@/modules/auth/store";
import { computed } from "vue";
import axios from "axios";

const { APP_API_BASE_URL, APP_API_VERSION, APP_AUTH_TOKEN, PROD_BASE_URL } =
  constants;
const { mutateProfile } = useSettingsMutations();
const authStore = useAuthStore();

const profileUtil = new useProfile(authStore);

const getBusinessProfile = computed(() => profileUtil.getBusiness());

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

const getPublishableKeyHeaders = () => {
  const headers: Record<string, string> = {};
  const business = getBusinessProfile.value;

  if (business?.businessId) {
    headers["business-id"] = business.businessId;
  }

  if (business?.businessMode) {
    headers["environment"] = business.businessMode;
  }

  return headers;
};

export const fetchPublishableKey = async () => {
  try {
    const response = await axios.get(
      `${PROD_BASE_URL}/v1/${settingsRoutes.publishableKey}`,
      { headers: getPublishableKeyHeaders() },
    );

    return {
      code: response.status,
      data: response.data,
      message: response.data?.message,
    };
  } catch (error: any) {
    const status = error?.response?.status;
    const data = error?.response?.data;

    return {
      code: status || 500,
      data: data || null,
      message: data?.message || error.message,
    };
  }
};

export const generatePublishableKey = async (payload: any) => {
  try {
    const response = await axios.post(
      `${PROD_BASE_URL}/v1/${settingsRoutes.publishableKey}`,
      payload,
      { headers: getPublishableKeyHeaders() },
    );

    return {
      code: response.status,
      data: response.data,
      message: response.data?.message,
    };
  } catch (error: any) {
    const status = error?.response?.status;
    const data = error?.response?.data;

    return {
      code: status || 500,
      data: data || null,
      message: data?.message || error.message,
    };
  }
};

export const regeneratePublishableKey = async () => {
  try {
    const response = await axios.delete(
      `${PROD_BASE_URL}/v1/${settingsRoutes.publishableKeyRegenerate}`,
      { headers: getPublishableKeyHeaders() },
    );

    return {
      code: response.status,
      data: response.data,
      message: response.data?.message,
    };
  } catch (error: any) {
    const status = error?.response?.status;
    const data = error?.response?.data;

    return {
      code: status || 500,
      data: data || null,
      message: data?.message || error.message,
    };
  }
};

export const whitelistPublishableKey = async (payload: any) => {
  try {
    const response = await axios.put(
      `${PROD_BASE_URL}/v1/${settingsRoutes.publishableKeyWhitelist}`,
      payload,
      { headers: getPublishableKeyHeaders() },
    );

    return {
      code: response.status,
      data: response.data,
      message: response.data?.message,
    };
  } catch (error: any) {
    const status = error?.response?.status;
    const data = error?.response?.data;

    return {
      code: status || 500,
      data: data || null,
      message: data?.message || error.message,
    };
  }
};

export const revokePublishableKey = async () => {
  try {
    const response = await axios.post(
      `${PROD_BASE_URL}/v1/${settingsRoutes.publishableKeyRevoke}`,
      null,
      { headers: getPublishableKeyHeaders() },
    );

    return {
      code: response.status,
      data: response.data,
      message: response.data?.message,
    };
  } catch (error: any) {
    const status = error?.response?.status;
    const data = error?.response?.data;

    return {
      code: status || 500,
      data: data || null,
      message: data?.message || error.message,
    };
  }
};
