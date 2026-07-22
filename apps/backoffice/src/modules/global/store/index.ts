// index.ts
import { defineStore } from "pinia";
import { useGlobalActions } from "./actions";

export const useGlobalStore = defineStore("global", () => {
  const actions = useGlobalActions();

  return {
    ...actions,
  };
});
