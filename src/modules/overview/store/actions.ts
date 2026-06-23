import { computed } from "vue";
import constants from "@/shared/utilities/constants";
import { useServiceAPI, useProfile } from "@packages/hooks";
import { overviewRoutes } from "./overview-routes";
import { useAuthStore } from "@/modules/auth/store";
import { IWalletBalance, ITaxBalance } from "./state";
import { useOverviewMutations } from "./mutations";

const { PORTAL_API_BASE_URL, PORTAL_API_VERSION, PORTAL_AUTH_TOKEN } =
  constants;
const { mutateWalletBalance, mutateTaxBalance } = useOverviewMutations();

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

export const updateWalletState = ({
  walletBalance,
  taxBalance,
}: {
  walletBalance: IWalletBalance[];
  taxBalance: ITaxBalance[];
}) => {
  mutateWalletBalance(walletBalance);
  mutateTaxBalance(taxBalance);
};

export const getWallets = async () => {
  return await $api.fetch(overviewRoutes.getWalletBalance);
};

export const createWallet = async (payload: any) => {
  return await $api.push(overviewRoutes.createWallet, payload);
};

export const onboardMerchant = async (payload: any) => {
  return await $api.push(overviewRoutes.onboardMerchant, payload);
};

export const bulkUploadMerchants = async (payload: any) => {
  return await $api.push(overviewRoutes.bulkUploadMerchant, payload);
};
