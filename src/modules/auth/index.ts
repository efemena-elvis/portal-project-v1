import { IRouteType } from "@packages/models";
import AuthLayout from "@/modules/auth/layouts/auth-layout.vue";
import BaseLayout from "@/layouts/base-layout.vue";
import LoginPage from "@/modules/auth/pages/login.vue";
import VerifyAccountPage from "@/modules/auth/pages/verify-account.vue";
import ConfirmVerifyAccountPage from "@/modules/auth/pages/confirm-verify-account.vue";
import LogoutPage from "@/modules/auth/pages/logout.vue";
import MfaSetupPage from "@/modules/auth/pages/mfa-setup.vue";
import PasswordRequestPage from "@/modules/auth/pages/password-request.vue";
import PasswordResetPage from "@/modules/auth/pages/password-reset.vue";
import ChangePasswordPage from "@/modules/auth/pages/change-password.vue";

// *********** VESICASH AUTHENTICATED ROUTES *********** //
const authRoutes: IRouteType[] = [
  {
    path: "/login",
    alias: "/",
    component: AuthLayout,
    children: [
      {
        path: "",
        name: "VesicashLogin",
        component: LoginPage,
        meta: {
          guest: true,
          title: "Login",
        },
      },
    ],
  },

  {
    path: "/password-request",
    component: AuthLayout,
    children: [
      {
        path: "",
        name: "VesicashPasswordRequest",
        component: PasswordRequestPage,
        meta: {
          open: true,
          title: "Forgot Password",
        },
      },
    ],
  },

  {
    path: "/verify-account",
    component: AuthLayout,
    children: [
      {
        path: "",
        name: "VesicashVerifyAccount",
        component: VerifyAccountPage,
        meta: {
          open: true,
          title: "Verify Email",
        },
      },
      {
        path: "/confirm-verify-account",
        name: "VesicashConfirmVerifyAccount",
        component: ConfirmVerifyAccountPage,
        meta: {
          open: true,
          title: "Confirm Verify Email",
        },
      },
    ],
  },

  {
    path: "/reset-password",
    component: AuthLayout,
    children: [
      {
        path: "",
        name: "VesicashResetPassword",
        component: PasswordResetPage,
        meta: {
          open: true,
          title: "Reset Password",
        },
      },
    ],
  },

  {
    path: "/change-password",
    component: BaseLayout,
    children: [
      {
        path: "",
        name: "VesicashChangePassword",
        component: ChangePasswordPage,
        meta: {
          requiresAuth: true,
          title: "Change Password",
        },
      },
    ],
  },

  {
    path: "/mfa/setup",
    component: AuthLayout,
    children: [
      {
        path: "",
        name: "VesicashMfaSetup",
        component: MfaSetupPage,
        meta: {
          open: true,
          title: "Set up 2FA",
        },
      },
    ],
  },

  {
    path: "/logout",
    name: "VesicashLogout",
    component: LogoutPage,
    meta: {
      open: true,
      title: "Logout",
    },
  },
];

export default authRoutes;
