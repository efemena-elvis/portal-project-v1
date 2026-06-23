import { useServiceAPI, useStorage } from "@packages/hooks";
import { authRoutes } from "./auth-routes";
import { useAuthMutations } from "./mutations";
import { IAPIType } from "@packages/models";
import constants from "@/shared/utilities/constants";

const { getStorage } = useStorage();

export function useAuthActions() {
  const { PORTAL_API_BASE_URL, PORTAL_API_VERSION, PORTAL_AUTH_TOKEN } =
    constants;

  const $api = new useServiceAPI({
    API_BASE_URL: PORTAL_API_BASE_URL,
    API_VERSION: PORTAL_API_VERSION,
    TOKEN_KEY: PORTAL_AUTH_TOKEN,
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

export const refreshAccessToken = async () => {
  const {
    PORTAL_API_BASE_URL,
    PORTAL_API_VERSION,
    PORTAL_REFRESH_TOKEN: REFRESH_KEY,
  } = constants;

  const refreshTokenValue = getStorage({ storage_name: REFRESH_KEY }) as
    | string
    | null;
  if (!refreshTokenValue) return null;

  try {
    const res = await fetch(
      `${PORTAL_API_BASE_URL}/${PORTAL_API_VERSION}/auth/refresh`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshTokenValue }),
      },
    );
    const json = await res.json();
    if (json?.code === 200 && json.data) {
      const { mutateAuthToken: setToken, mutateRefreshToken: setRefresh } =
        useAuthMutations();
      setToken(json.data);
      setRefresh(json.data);
      return json.data.access_token || json.data.auth_token || null;
    }
    return null;
  } catch {
    return null;
  }
};
