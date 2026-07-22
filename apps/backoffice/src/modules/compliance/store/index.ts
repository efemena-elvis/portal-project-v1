// index.ts
import { defineStore } from "pinia";
import * as state from "./state";
import * as getters from "./getters";
import * as actions from "./actions";

export const useComplianceStore = defineStore("compliance", () => {
  return {
    ...state,
    ...getters,
    ...actions,
  };
});
