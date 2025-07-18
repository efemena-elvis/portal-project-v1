import { walletBalance, IWalletBalance } from "./state";

export function useOverviewMutations() {
  const mutateWalletBalance = (payload: IWalletBalance[]) => {
    walletBalance.value = payload;
  };

  return {
    mutateWalletBalance,
  };
}
