import { computed } from "vue";
import constants from "@/shared/utilities/constants";
import { useServiceAPI, useProfile } from "@packages/hooks";
import { feeRoutes } from "./fee-routes";
import { useAuthStore } from "@/modules/auth/store";

const { MOR_API_BASE_URL, MOR_API_VERSION, MOR_AUTH_TOKEN } = constants;

const authStore = useAuthStore();
const profileUtil = new useProfile(authStore);

const getBusinessProfile = computed(() => profileUtil.getBusiness());
const activeMode = getBusinessProfile.value?.businessMode || "test";

const publicKey = computed(() =>
  activeMode === "test"
    ? profileUtil.getAPIKeys().test.public
    : profileUtil.getAPIKeys().live.public,
);

const secretKey = computed(() =>
  activeMode === "test"
    ? profileUtil.getAPIKeys().test.secret
    : profileUtil.getAPIKeys().live.secret,
);

const $api = new useServiceAPI({
  API_BASE_URL: MOR_API_BASE_URL,
  API_VERSION: MOR_API_VERSION,
  TOKEN_KEY: MOR_AUTH_TOKEN,
  HEADERS: {
    "public-key": publicKey.value,
    "secret-key": secretKey.value,
  },
});

export const getFees = async (payload: any) => {
  return await $api.fetch(
    `${feeRoutes.getFees}${payload.filters ? payload.filters : `?page=${payload.page}`}`,
  );
};

export const getSingleFee = async (id: string) => {
  return await $api.fetch(`${feeRoutes.getSingleFee}/${id}`);
};

export const createFee = async (payload: any) => {
  return await $api.push(feeRoutes.createFee, payload);
};

export const updateFee = async (id: string, payload: any) => {
  return await $api.push(`${feeRoutes.updateFee}/${id}`, payload);
};
