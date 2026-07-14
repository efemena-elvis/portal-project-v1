import constants from "@/shared/utilities/constants";
import { useServiceAPI, useProfile } from "@packages/hooks";
import { aggregatorRoutes } from "./aggregator-routes";
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

export const getAggregators = async (payload: any) => {
  return await getApi().fetch(
    `${aggregatorRoutes.getAggregators}${payload.filters ? payload.filters : `?page=${payload.page}`}`,
  );
};

export const getSingleAggregator = async (id: string) => {
  return await getApi().fetch(`${aggregatorRoutes.getSingleAggregator}/${id}`);
};

export const getAggregatorMerchants = async (payload: any) => {
  return await getApi().fetch(
    `${aggregatorRoutes.getAggregatorMerchants}/${payload.id}/merchants${payload.filters || ""}`,
  );
};

export const resetAggregatorPassword = async (id: string) => {
  return await getApi().push(
    `${aggregatorRoutes.resetAggregatorPassword}/${id}/reset-password`,
  );
};

export const loginAggregatorAccount = async (id: string) => {
  return await getApi().push(
    `${aggregatorRoutes.loginAggregatorAccount}/${id}/login`,
  );
};

export const deleteAggregator = async (id: string) => {
  return await getApi().delete(`${aggregatorRoutes.deleteAggregator}/${id}`);
};

export const resetAggregatorMfa = async (userId: string) => {
  return await getApi().push(aggregatorRoutes.resetMfa, { user_id: userId });
};
