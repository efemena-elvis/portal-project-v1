import constants from "@/shared/utilities/constants";
import { useServiceAPI, useProfile } from "@packages/hooks";
import { teamRoutes } from "./team-routes";
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

export const getTeams = async (payload: any) => {
  return await getApi().fetch(
    `${teamRoutes.getTeams}${payload.filters ? payload.filters : `?page=${payload.page}`}`,
  );
};

export const getActivities = async (payload: any) => {
  return await getApi().fetch(
    `${teamRoutes.getActivities}${payload.filters ? payload.filters : ""}`,
  );
};
