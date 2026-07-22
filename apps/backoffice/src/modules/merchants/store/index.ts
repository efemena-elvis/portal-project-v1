import { defineStore } from "pinia";
import * as actions from "./actions";
import * as getters from "./getters";
import * as state from "./state";
import { useMerchantMutations } from "./mutations";

export const useMerchantStore = defineStore("merchant", () => {
  const mutations = useMerchantMutations();

  return {
    ...state,
    ...getters,
    ...actions,
    ...mutations,
  };
});
