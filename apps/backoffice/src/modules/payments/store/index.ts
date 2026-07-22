import { defineStore } from "pinia";
import * as actions from "./actions";

export const usePaymentStore = defineStore("payment", () => {
  return {
    ...actions,
  };
});
