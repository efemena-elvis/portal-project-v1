import { approvalsList, approvalsDetail } from "./state";

export function useApprovalsMutations() {
  const mutateApprovalsList = (payload: any[]) => {
    approvalsList.value = payload;
  };

  const mutateApprovalsDetail = (payload: Record<string, any> | null) => {
    approvalsDetail.value = payload;
  };

  return {
    mutateApprovalsList,
    mutateApprovalsDetail,
  };
}
