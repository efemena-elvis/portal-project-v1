import { computed } from "vue";
import constants from "@/shared/utilities/constants";
import { useServiceAPI } from "@packages/hooks";
import { overviewRoutes } from "./overview-routes";
import { useProfile } from "@packages/hooks";
import { useAuthStore } from "@/modules/auth/store";
import { IWalletBalance } from "./state";
import { useOverviewMutations } from "./mutations";

const { APP_API_BASE_URL, APP_API_VERSION, APP_AUTH_TOKEN } = constants;
const { mutateWalletBalance } = useOverviewMutations();

const authStore = useAuthStore();
const profileUtil = new useProfile(authStore);

const getBusinessProfile = computed(() => profileUtil.getBusiness());
const activeMode = getBusinessProfile.value?.businessMode || "test";

const publicKey = computed(() =>
  activeMode === "test"
    ? profileUtil.getAPIKeys().test.public
    : profileUtil.getAPIKeys().live.public
);

const privateKey = computed(() =>
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
    "private-key": privateKey.value,
  },
});

export const updateWalletState = ({
  walletBalance,
}: {
  walletBalance: IWalletBalance[];
}) => {
  mutateWalletBalance(walletBalance);
};

export const getWallets = async () => {
  return await $api.fetch(overviewRoutes.getWalletBalance);
};

export const createWallet = async (payload: any) => {
  return await $api.push(overviewRoutes.createWallet, payload);
};
