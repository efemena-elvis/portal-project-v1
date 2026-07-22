import { defineStore } from "pinia";
import * as actions from "./actions";
import * as getters from "./getters";
import * as state from "./state";
import { useApprovalsMutations } from "./mutations";

export const useApprovalsStore = defineStore("approvals", () => {
  const mutations = useApprovalsMutations();

  return {
    ...state,
    ...getters,
    ...actions,
    ...mutations,
  };
});
