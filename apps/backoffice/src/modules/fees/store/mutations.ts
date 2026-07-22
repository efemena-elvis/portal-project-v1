import { feeList, feeDetail } from "./state";

export function useFeeMutations() {
  const mutateFeeList = (payload: any[]) => {
    feeList.value = payload;
  };

  const mutateFeeDetail = (payload: Record<string, any> | null) => {
    feeDetail.value = payload;
  };

  return {
    mutateFeeList,
    mutateFeeDetail,
  };
}
