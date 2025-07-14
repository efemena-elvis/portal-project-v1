import { useServiceAPI } from "@packages/hooks";
import { authRoutes } from "./auth-routes";
import { useAuthMutations } from "./mutations";
import { IAPIType } from "@packages/models";
import constants from "@/shared/utilities/constants";

export function useAuthActions() {
  const { MOR_API_BASE_URL, MOR_API_VERSION, MOR_AUTH_TOKEN } = constants;

  const $api = new useServiceAPI({
    API_BASE_URL: MOR_API_BASE_URL,
    API_VERSION: MOR_API_VERSION,
    TOKEN_KEY: MOR_AUTH_TOKEN,
  });

  const { mutateUserData } = useAuthMutations();
const loginUser = async (payload: any): Promise<IAPIType> => {
  const response: any = await $api.push(authRoutes.login, payload);

  if (response?.code === 200) {
    // Normalize the structure to match what `mutateUserData` expects
    const normalizedPayload = {
      ...response.data,
      user: {
        ...response.data.user,
        business_users: [response.data.user.business_user], 
      },
    };

    mutateUserData(normalizedPayload);
  }

  return response;
};

  const signupUser = async (payload: any) => {
    return await $api.push(authRoutes.signup, payload);
  };

  const requestUserPassword = async (payload: any) => {
    return await $api.push(authRoutes.passwordRequest, payload);
  };

  const resetUserPassword = async (payload: any) => {
    return await $api.push(authRoutes.passwordReset, payload);
  };

  const sendVerifyEmailOTP = async (payload: any) => {
    return await $api.push(authRoutes.sendVerifyEmail, payload);
  };

  const verifyEmailOTP = async (payload: any) => {
    return await $api.push(authRoutes.verifyEmail, payload);
  };

  const logoutUser = () => {
    localStorage.clear();
    location.href = "/";
  };

  return {
    loginUser,
    signupUser,
    requestUserPassword,
    resetUserPassword,
    sendVerifyEmailOTP,
    verifyEmailOTP,
    logoutUser,
  };
}
