import { useServiceAPI } from "@packages/hooks";
import { balanceRoutes } from "./balance-routes";
import constants from "@/shared/utilities/constants";
import { useProfile } from "@packages/hooks";
import { useAuthStore } from "@/modules/auth/store";
import { computed } from "vue";

const { APP_API_BASE_URL, APP_API_VERSION, APP_AUTH_TOKEN } = constants;

const authStore = useAuthStore();
const profileUtil = new useProfile(authStore);

const getBusinessProfile = computed(() => profileUtil.getBusiness());
const activeMode = getBusinessProfile.value?.businessMode || "test";
const publicKey = computed(() =>
  activeMode === "test"
    ? profileUtil.getAPIKeys().test.public
    : profileUtil.getAPIKeys().live.public
);
const secretKey = computed(() =>
  activeMode === "test"
    ? profileUtil.getAPIKeys().test.secret
    : profileUtil.getAPIKeys().live.secret
);

const $api = new useServiceAPI({
  API_BASE_URL: APP_API_BASE_URL,
  API_VERSION: APP_API_VERSION,
  TOKEN_KEY: APP_AUTH_TOKEN,
  HEADERS: {
    "public-key": publicKey.value,
    "secret-key": secretKey.value,
  },
});

export const getBalanceHistory = async (payload: any) => {
  return await $api.fetch(
    `${balanceRoutes.getBalanceHistory}${payload.filters ? payload.filters : `?page=${payload.page}`}`
  );
};

export const initiatePayout = async (payload: any) => {
  return await $api.push(balanceRoutes.initiatePayout, payload);
};

export const getPayouts = async (payload: any) => {
  return await $api.fetch(
    `${balanceRoutes.getAllPayouts}${payload.filters ? payload.filters : `?page=${payload.page}`}`
  );
};

export const fetchAllPayouts = async () => {
  return await $api.fetch(`${balanceRoutes.getAllPayouts}?limit=100000`);
};

export const getTransactionStats = async () => {
  return await $api.fetch(balanceRoutes.getTransactionStats)
};