// index.ts
import { defineStore } from "pinia";
import { useAuthState } from "./state";
import { useAuthGetters } from "./getters";
import { useAuthMutations } from "./mutations";
import { useAuthActions } from "./actions";

export const useAuthStore = defineStore("auth", () => {
  const state = useAuthState();
  const getters = useAuthGetters(state);
  const mutations = useAuthMutations(state);
  const actions = useAuthActions(mutations);

  return {
    ...state,
    ...getters,
    ...mutations,
    ...actions,
  };
});
