import { ref, computed } from "vue";
import constants from "@/shared/utilities/constants";
import { useServiceAPI } from "@packages/hooks";
import { overviewRoutes } from "./overview-routes";
import { useProfile } from "@packages/hooks";
import { useAuthStore } from "@/modules/auth/store";
import { IWalletBalance, ITaxBalance } from "./state";
import { useOverviewMutations } from "./mutations";

const { MOR_API_BASE_URL, MOR_API_VERSION, MOR_AUTH_TOKEN } = constants;
const { mutateWalletBalance, mutateTaxBalance } = useOverviewMutations();

const authStore = useAuthStore();
const profileUtil = new useProfile(authStore);

const getBusinessProfile = computed(() => profileUtil.getBusiness());
const activeMode = getBusinessProfile.value?.businessMode || "test";

const publicKey = computed(() =>
  activeMode === "test"
    ? profileUtil.getAPIKeys().test.public
    : profileUtil.getAPIKeys().live.public
);

const $api = new useServiceAPI({
  API_BASE_URL: MOR_API_BASE_URL,
  API_VERSION: MOR_API_VERSION,
  TOKEN_KEY: MOR_AUTH_TOKEN,
  HEADERS: {
    "public-key": publicKey.value,
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
