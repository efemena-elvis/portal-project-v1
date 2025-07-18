import { defineStore } from "pinia";
import * as actions from "./actions";
import * as getters from "./getters";
import * as state from "./state";
import { useOverviewMutations } from "./mutations";

export const useOverviewStore = defineStore("overview", () => {
  const mutations = useOverviewMutations();

  return {
    ...state,
    ...getters,
    ...actions,
    ...mutations,
  };
});
