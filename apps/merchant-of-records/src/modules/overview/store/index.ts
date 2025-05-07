import { defineStore } from "pinia";
import * as actions from "./actions";

export const useOverviewStore = defineStore("overview", () => {
  return {
    ...actions,
  };
});
