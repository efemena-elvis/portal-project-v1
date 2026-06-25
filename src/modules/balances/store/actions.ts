import { useServiceAPI, useProfile } from "@packages/hooks";
import { balanceRoutes } from "./balance-routes";
import constants from "@/shared/utilities/constants";
import { useAuthStore } from "@/modules/auth/store";

const { PORTAL_API_BASE_URL, PORTAL_API_VERSION, PORTAL_AUTH_TOKEN } =
  constants;

let _api: useServiceAPI;

const getApi = () => {
  if (!_api) {
    const authStore = useAuthStore();
    const profileUtil = new useProfile(authStore);
    const activeMode = profileUtil.getBusiness()?.businessMode || "test";
    _api = new useServiceAPI({
      API_BASE_URL: PORTAL_API_BASE_URL,
      API_VERSION: PORTAL_API_VERSION,
      TOKEN_KEY: PORTAL_AUTH_TOKEN,
      HEADERS: {
        "public-key":
          activeMode === "test"
            ? profileUtil.getAPIKeys().test.public
            : profileUtil.getAPIKeys().live.public,
        "secret-key":
          activeMode === "test"
            ? profileUtil.getAPIKeys().test.secret
            : profileUtil.getAPIKeys().live.secret,
      },
    });
  }
  return _api;
};

export const getTransactionStats = async () => {
  return await getApi().fetch(balanceRoutes.getTransactionStats);
};

export const getAllWithdrawalRequests = async (payload: any) => {
  return await getApi().fetch(
    `${balanceRoutes.getAllWithdrawalRequests}${payload.filters ? payload.filters : `?page=${payload.page}`}`,
  );
};

export const decideWithdrawalRequest = async (payload: { uuid: string; action: string }) => {
  return await getApi().push(
    `${balanceRoutes.getAllWithdrawalRequests}/${payload.uuid}/decision`,
    { action: payload.action },
  );
};
