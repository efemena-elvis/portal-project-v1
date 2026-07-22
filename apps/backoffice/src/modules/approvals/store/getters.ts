import { computed } from "vue";
import { approvalsList, approvalsDetail } from "./state";

export const getAllApprovals = computed(() => approvalsList.value);
export const getCurrentApproval = computed(() => approvalsDetail.value);
