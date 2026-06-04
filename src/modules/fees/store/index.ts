import { defineStore } from "pinia";
import * as actions from "./actions";
import * as getters from "./getters";
import * as state from "./state";
import { useFeeMutations } from "./mutations";

export const useFeeStore = defineStore("fee", () => {
  const mutations = useFeeMutations();

  return {
    ...state,
    ...getters,
    ...actions,
    ...mutations,
  };
});
