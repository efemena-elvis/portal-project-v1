import { useServiceAPI } from "@packages/hooks";
import { balanceRoutes } from "./balance-routes";
import constants from "@/shared/utilities/constants";
import { useProfile } from "@packages/hooks";
import { useAuthStore } from "@/modules/auth/store";
import { computed } from "vue";

const { MOR_API_BASE_URL, MOR_API_VERSION, MOR_AUTH_TOKEN, ENVIRONMENT } =
  constants;

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
  API_BASE_URL: MOR_API_BASE_URL,
  API_VERSION: MOR_API_VERSION,
  TOKEN_KEY: MOR_AUTH_TOKEN,
  HEADERS: {
    "public-key": publicKey.value,
    "secret-key": secretKey.value,
    "x-api-key": "EKtNqS86B1oFgcjZFr1484SdrqXyxK12AZj1fW6",
    "x-environments": ENVIRONMENT,
  },
});

export const getBalanceHistory = async (payload: number) => {
  return await $api.fetch(`${balanceRoutes.getBalanceHistory}?page=${payload}`);
};

export const initiatePayout = async (payload: any) => {
  return await $api.push(balanceRoutes.initiatePayout);
};

export const fetchAllPayouts = async (payload: number) => {
  return await $api.fetch(`${balanceRoutes.getAllPayouts}?page=${payload}`);
};