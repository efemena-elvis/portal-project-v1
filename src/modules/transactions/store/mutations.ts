import { transactionList, transactionDetail } from "./state";

export function useTransactionMutations() {
  const mutateTransactionList = (payload: any[]) => {
    transactionList.value = payload;
  };

  const mutateTransactionDetail = (payload: Record<string, any> | null) => {
    transactionDetail.value = payload;
  };

  return {
    mutateTransactionList,
    mutateTransactionDetail,
  };
}
