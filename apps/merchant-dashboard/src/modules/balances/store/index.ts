import { defineStore } from "pinia";
import * as actions from "./actions";

export const useBalanceStore = defineStore("balance", () => {
  return {
    ...actions,
  };
});