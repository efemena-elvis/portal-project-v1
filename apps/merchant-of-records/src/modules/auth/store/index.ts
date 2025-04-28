// index.ts
import { defineStore } from "pinia";
import { useAuthState } from "./state";
import { useAuthGetters } from "./getters";
import { useAuthActions } from "./actions";

export const useAuthStore = defineStore("auth", () => {
  const state = useAuthState();
  const getters = useAuthGetters();
  const actions = useAuthActions();

  return {
    ...state,
    ...getters,
    ...actions,
  };
});
