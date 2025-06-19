// index.ts
import { defineStore } from "pinia";
import * as state from "./state";
import * as getters from "./getters";
import * as actions from "./actions";

export const useSettingsStore = defineStore("settings", () => {
  return {
    ...state,
    ...getters,
    ...actions,
  };
});
