import { defineStore } from "pinia";
import * as actions from "./actions";

export const useStoreStore = defineStore("store", () => {
  return {
    ...actions,
  };
});
