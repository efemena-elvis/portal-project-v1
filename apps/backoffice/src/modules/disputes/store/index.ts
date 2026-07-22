import { defineStore } from "pinia";
import * as actions from "./actions";
import * as getters from "./getters";
import * as state from "./state";
import { useDisputeMutations } from "./mutations";

export const useDisputeStore = defineStore("dispute", () => {
  const mutations = useDisputeMutations();

  return {
    ...state,
    ...getters,
    ...actions,
    ...mutations,
  };
});
