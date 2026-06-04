import { computed } from "vue";
import { useAuthState } from "./state";

export function useAuthGetters() {
  const { authToken, authUser, authBusiness, authBusinessToken } =
    useAuthState();

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
