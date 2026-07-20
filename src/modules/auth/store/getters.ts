import { computed } from "vue";
import { useAuthState } from "./state";

type AuthState = ReturnType<typeof useAuthState>;

export function useAuthGetters(state: AuthState) {
  const { authToken, authUser, authBusiness, authBusinessToken } = state;

  const getAuthToken = computed(() => authToken.value);
  const getAuthUser = computed(() => authUser.value);
  const getAuthBusiness = computed(() => authBusiness.value);
  const getAuthBusinessToken = computed(() => authBusinessToken.value);

  return {
    getAuthToken,
    getAuthUser,
    getAuthBusiness,
    getAuthBusinessToken,
  };
}
