const nameSpace: string = "auth";

export const authRoutes = {
  login: `${nameSpace}/login`,
  signup: `${nameSpace}/signup`,
  passwordRequest: `${nameSpace}/forgot-password`,
  passwordReset: `${nameSpace}/reset-password`,
  sendVerifyEmail: `${nameSpace}/send-verify-email`,
  verifyEmail: `${nameSpace}/verify-email`,
  authRefresh: `${nameSpace}/refresh`,
  mfaSetup: `mfa/setup/authenticator`,
  mfaVerify: `mfa/verify`,
  verifyLogin: `${nameSpace}/verify-login`,
  changePassword: `${nameSpace}/change-password`,
  resetMfa: `admin/merchants/mfa/reset`,
};