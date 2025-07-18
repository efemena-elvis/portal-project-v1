import { computed } from "vue";
import { useServiceAPI } from "@packages/hooks";
import { complianceRoutes } from "./compliance-routes";
import constants from "@/shared/utilities/constants";
import { useProfile } from "@packages/hooks";
import { useAuthStore } from "@/modules/auth/store";

const { MOR_API_BASE_URL, MOR_API_VERSION, MOR_AUTH_TOKEN } = constants;

const authStore = useAuthStore();
const profileUtil = new useProfile(authStore);

const getBusinessProfile = computed(() => profileUtil.getBusiness());
const activeMode = getBusinessProfile.value?.businessMode || "test";

const publicKey = computed(() =>
  activeMode === "test"
    ? profileUtil.getAPIKeys().test.public
    : profileUtil.getAPIKeys().live.public
);

const privateKey = computed(() =>
  activeMode === "test"
    ? profileUtil.getAPIKeys().test.secret
    : profileUtil.getAPIKeys().live.secret
);

const $api = new useServiceAPI({
  API_BASE_URL: MOR_API_BASE_URL,
  API_VERSION: MOR_API_VERSION,
  TOKEN_KEY: MOR_AUTH_TOKEN,
  // HEADERS: {
  //   "public-key": publicKey.value,
  //   "private-key": privateKey.value,
  // },
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

export const getMerchantOnDraft = async () => {
  return await $api.fetch(complianceRoutes.getDraftedMerchants);
};

export const onboardBulkMerchant = async (payload: any) => {
  return await $api.push(complianceRoutes.onboardBulkMerchants, payload);
};

export const activateBulkMerchants = async () => {
  return await $api.push(complianceRoutes.activateBulkMerchants, {});
};
