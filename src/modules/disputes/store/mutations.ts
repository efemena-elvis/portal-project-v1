import { disputeList, disputeDetail } from "./state";

export function useDisputeMutations() {
  const mutateDisputeList = (payload: any[]) => {
    disputeList.value = payload;
  };

  const mutateDisputeDetail = (payload: Record<string, any> | null) => {
    disputeDetail.value = payload;
  };

  return {
    mutateDisputeList,
    mutateDisputeDetail,
  };
}
