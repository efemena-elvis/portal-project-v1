import constants from "@/shared/utilities/constants";
import { useServiceAPI, useProfile } from "@packages/hooks";
import { overviewRoutes } from "./overview-routes";
import { useAuthStore } from "@/modules/auth/store";
import { IWalletBalance, ITaxBalance } from "./state";
import { useOverviewMutations } from "./mutations";

const { PORTAL_API_BASE_URL, PORTAL_API_VERSION, PORTAL_AUTH_TOKEN } =
  constants;
const { mutateWalletBalance, mutateTaxBalance } = useOverviewMutations();

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
  return await getApi().fetch(overviewRoutes.getWalletBalance);
};

export const createWallet = async (payload: any) => {
  return await getApi().push(overviewRoutes.createWallet, payload);
};

export const onboardMerchant = async (payload: any) => {
  return await getApi().push(overviewRoutes.onboardMerchant, payload);
};

export const bulkUploadMerchants = async (payload: any) => {
  return await getApi().push(overviewRoutes.bulkUploadMerchant, payload);
};
