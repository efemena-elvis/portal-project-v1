import { useServiceAPI, useProfile } from "@packages/hooks";
import { balanceRoutes } from "./balance-routes";
import constants from "@/shared/utilities/constants";
import { useAuthStore } from "@/modules/auth/store";
import { computed } from "vue";

const {
  PORTAL_API_BASE_URL,
  PORTAL_API_VERSION,
  PORTAL_AUTH_TOKEN,
  ENVIRONMENT,
} = constants;

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
  API_BASE_URL: PORTAL_API_BASE_URL,
  API_VERSION: PORTAL_API_VERSION,
  TOKEN_KEY: PORTAL_AUTH_TOKEN,
  HEADERS: {
    "public-key": publicKey.value,
    "secret-key": secretKey.value,
  },
});

export const getTransactionStats = async () => {
  return await $api.fetch(balanceRoutes.getTransactionStats);
};


export const getAllWithdrawalRequests = async (payload: any) => {
  return await $api.fetch(
    `${balanceRoutes.getAllWithdrawalRequests}${payload.filters ? payload.filters : `?page=${payload.page}`}`,
  );
};

export const decideWithdrawalRequest = async (payload: { uuid: string; action: string }) => {
  return await $api.push(
    `${balanceRoutes.getAllWithdrawalRequests}/${payload.uuid}/decision`,
    { action: payload.action },
  );
};

// export const fetchAllWithdrawalRequests = async () => {
//   return await $api.fetch(`${balanceRoutes.getAllWithdrawalRequests}?limit=100000`);
// };
