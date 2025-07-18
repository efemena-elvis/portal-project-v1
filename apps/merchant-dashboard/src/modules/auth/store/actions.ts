import { useServiceAPI } from "@packages/hooks";
import { authRoutes } from "./auth-routes";
import { useAuthMutations } from "./mutations";
import { IAPIType } from "@packages/models";
import constants from "@/shared/utilities/constants";

export function useAuthActions() {
  const { APP_API_BASE_URL, APP_API_VERSION, APP_AUTH_TOKEN } = constants;

  // console.log("Using Auth Actions with API Base URL:", APP_API_BASE_URL);
  // console.log("Using Auth Actions with API Version:", APP_API_VERSION);

  const $api = new useServiceAPI({
    API_BASE_URL: APP_API_BASE_URL,
    API_VERSION: APP_API_VERSION,
    TOKEN_KEY: APP_AUTH_TOKEN,
  });

  const { mutateUserData } = useAuthMutations();

  const loginUser = async (payload: any): Promise<IAPIType> => {
    const response: any = await $api.push(authRoutes.login, payload);

    response?.code === 200 && mutateUserData(response?.data);
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
