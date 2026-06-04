const nameSpace: string = "auth";

export const authRoutes = {
  login: `${nameSpace}/login`,
  signup: `${nameSpace}/signup`,
  passwordRequest: `${nameSpace}/password-request`,
  passwordReset: `${nameSpace}/reset-password`,
  sendVerifyEmail: `${nameSpace}/send-verify-email`,
  verifyEmail: `${nameSpace}/verify-email`,
};
