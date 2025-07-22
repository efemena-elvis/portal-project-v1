import { defineStore } from "pinia";
import * as actions from "./actions";
import * as getters from "./getters";
import * as state from "./state";

export const useStoreStore = defineStore("store", () => {
  return {
    ...actions,
    ...getters,
    ...state,
  };
});
