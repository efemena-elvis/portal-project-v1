import { computed } from "vue";
import constants from "@/shared/utilities/constants";
import { useServiceAPI, useProfile } from "@packages/hooks";
import { disputeRoutes } from "./dispute-routes";
import { useAuthStore } from "@/modules/auth/store";

const { PORTAL_API_BASE_URL, PORTAL_API_VERSION, PORTAL_AUTH_TOKEN } =
  constants;

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

export const getDisputes = async (payload: any) => {
  return await $api.fetch(
    `${disputeRoutes.getDisputes}${payload.filters ? payload.filters : `?page=${payload.page}`}`,
  );
};

export const getSingleDispute = async (id: string) => {
  return await $api.fetch(`${disputeRoutes.getSingleDispute}/${id}`);
};
