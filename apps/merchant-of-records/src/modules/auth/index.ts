import { IRouteType } from "@packages/models";

// *********** VESICASH AUTHENTICATED ROUTES *********** //
const authRoutes: IRouteType[] = [
  {
    path: "/login",
    alias: "/",
    component: () =>
      import(
        /* webpackChunkName: "auth-layout" */ "@/modules/auth/layouts/auth-layout.vue"
      ),
    children: [
      // *********** VESICASH LOGIN *********** //
      {
        path: "",
        name: "VesicashLogin",
        component: () =>
          import(
            /* webpackChunkName: "auth-module" */ "@/modules/auth/pages/login.vue"
          ),
        meta: {
          guest: true,
          title: "Login",
        },
      },
      {
        path: "/create-account",
        name: "VesicashCreateAccount",
        component: () =>
          import(
            /* webpackChunkName: "auth-module" */ "@/modules/auth/pages/create-account.vue"
          ),
        meta: {
          guest: true,
          title: "Create Account",
        },
      },
      {
        path: "/forgot-password",
        name: "VesicashPasswordRequest",
        component: () =>
          import(
            /* webpackChunkName: "auth-module" */ "@/modules/auth/pages/password-request.vue"
          ),
        meta: {
          guest: true,
          title: "Password Request",
        },
      },
      {
        path: "/confirm-forgot-password",
        name: "VesicashConfirmPasswordRequest",
        component: () =>
          import(
            /* webpackChunkName: "auth-module" */ "@/modules/auth/pages/confirm-password-request.vue"
          ),
        meta: {
          guest: true,
          title: "Confirm Password Request",
        },
      },
    ],
  },

  {
    path: "/verify-account",
    component: () =>
      import(
        /* webpackChunkName: "auth-layout" */ "@/modules/auth/layouts/auth-center-layout.vue"
      ),
    children: [
      {
        path: "",
        name: "VesicashVerifyAccount",
        component: () =>
          import(
            /* webpackChunkName: "auth-module" */ "@/modules/auth/pages/verify-account.vue"
          ),
        meta: {
          open: true,
          title: "Verify Email",
        },
      },
      {
        path: "/confirm-verify-account",
        name: "VesicashConfirmVerifyAccount",
        component: () =>
          import(
            /* webpackChunkName: "auth-module" */ "@/modules/auth/pages/confirm-verify-account.vue"
          ),
        meta: {
          open: true,
          title: "Confirm Verify Email",
        },
      },
      {
        path: "/password-reset/:token",
        name: "VesicashPasswordReset",
        component: () =>
          import(
            /* webpackChunkName: "auth-module" */ "@/modules/auth/pages/password-reset.vue"
          ),
        meta: {
          guest: true,
          title: "Password Reset",
        },
      },
      {
        path: "/confirm-password-reset",
        name: "VesicashConfirmPasswordReset",
        component: () =>
          import(
            /* webpackChunkName: "auth-module" */ "@/modules/auth/pages/confirm-password-reset.vue"
          ),
        meta: {
          guest: true,
          title: "Confirm Password Reset",
        },
      },
    ],
  },

  // LOGOUT ROUTE
  {
    path: "/logout",
    name: "VesicashLogout",
    component: () =>
      import(
        /* webpackChunkName: "auth-module" */ "@/modules/auth/pages/logout.vue"
      ),
    meta: {
      open: true,
      title: "Logout",
    },
  },
];

export default authRoutes;
