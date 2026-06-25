import { IRouteType } from "@packages/models";
import AuthLayout from "@/modules/auth/layouts/auth-layout.vue";
import LoginPage from "@/modules/auth/pages/login.vue";
import VerifyAccountPage from "@/modules/auth/pages/verify-account.vue";
import ConfirmVerifyAccountPage from "@/modules/auth/pages/confirm-verify-account.vue";
import LogoutPage from "@/modules/auth/pages/logout.vue";

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
