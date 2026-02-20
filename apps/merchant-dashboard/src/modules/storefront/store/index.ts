import { defineStore } from "pinia";
import * as actions from "./actions";

export const useStorefrontStore = defineStore("storefront", () => {
  return {
    ...actions,
  };
});
