// index.ts
import { defineStore } from "pinia";
import * as state from "./state";
import * as getters from "./getters";
import * as actions from "./actions";
import { useComplianceMutations } from "./mutations";

export const useComplianceStore = defineStore("compliance", () => {
  const mutations = useComplianceMutations();

  return {
    ...state,
    ...getters,
    ...actions,
    ...mutations,
  };
});
