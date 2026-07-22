import {
  walletBalance,
  taxBalance,
  IWalletBalance,
  ITaxBalance,
} from "./state";

export function useOverviewMutations() {
  const mutateWalletBalance = (payload: IWalletBalance[]) => {
    walletBalance.value = payload;
  };

  const mutateTaxBalance = (payload: ITaxBalance[]) => {
    taxBalance.value = payload;
  };

  return {
    mutateWalletBalance,
    mutateTaxBalance,
  };
}
