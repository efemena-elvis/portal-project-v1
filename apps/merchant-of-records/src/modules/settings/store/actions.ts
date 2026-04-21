import { useProfile, useServiceAPI } from "@packages/hooks";
import { settingsRoutes } from "./settings-routes";
import constants from "@/shared/utilities/constants";
import { useSettingsMutations } from "./mutations";
import { computed } from "vue";
import { useAuthStore } from "@/modules/auth/store";
import axios from "axios";

const { MOR_API_BASE_URL, MOR_API_VERSION, MOR_AUTH_TOKEN} = constants;
const { mutateProfile } = useSettingsMutations();
const authStore = useAuthStore();

const profileUtil = new useProfile(authStore);

const getBusinessProfile = computed(() => profileUtil.getBusiness());

const $api = new useServiceAPI({
  API_BASE_URL: MOR_API_BASE_URL,
  API_VERSION: MOR_API_VERSION,
  TOKEN_KEY: MOR_AUTH_TOKEN,
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

export const fetchPublishableKeys = async () => {
  try {
    const response = await axios.get(
      `${MOR_API_BASE_URL}/v1/${settingsRoutes.publishableKey}/all`,
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
      `${MOR_API_BASE_URL}/v1/${settingsRoutes.publishableKey}`,
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
      `${MOR_API_BASE_URL}/v1/${settingsRoutes.publishableKeyRegenerate}`,
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

export const updatePublishableKey = async (payload: any) => {
  try {
    const response = await axios.put(
      `${MOR_API_BASE_URL}/v1/${settingsRoutes.publishableKey}/${payload.id}`,
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

export const whitelistPublishableKey = async (payload: any) => {
  try {
    const response = await axios.put(
      `${MOR_API_BASE_URL}/v1/${settingsRoutes.publishableKeyWhitelist}`,
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

export const revokePublishableKey = async (payload: { key_id: string }) => {
  try {
    const response = await axios.delete(
      `${MOR_API_BASE_URL}/v1/${settingsRoutes.publishableKey}/${payload.key_id}`,

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

