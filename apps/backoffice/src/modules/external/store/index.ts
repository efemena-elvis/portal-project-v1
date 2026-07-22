import { defineStore } from "pinia";
import * as actions from "./actions";

export const useExternalStore = defineStore("external", () => {
  return {
    ...actions,
  };
});
