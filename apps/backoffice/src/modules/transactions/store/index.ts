import { defineStore } from "pinia";
import * as actions from "./actions";
import * as getters from "./getters";
import * as state from "./state";
import { useTransactionMutations } from "./mutations";

export const useTransactionStore = defineStore("transaction", () => {
  const mutations = useTransactionMutations();

  return {
    ...state,
    ...getters,
    ...actions,
    ...mutations,
  };
});
