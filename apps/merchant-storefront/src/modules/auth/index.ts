import { IRouteType } from "@packages/models";

// *********** STORO AUTHENTICATED ROUTES *********** //
const authRoutes: IRouteType[] = [
  
  {
    path: "/login",
    alias: "",
    component: () =>
      import(
        /* webpackChunkName: "auth-layout" */ "@/modules/auth/layouts/auth-layout.vue"
      ),
    children: [
      // *********** STORO LOGIN *********** //
      {
        path: "",
        name: "StoroLogin",
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
        name: "StoroCreateAccount",
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
        name: "StoroPasswordRequest",
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
        name: "StoroConfirmPasswordRequest",
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
        name: "StoroVerifyAccount",
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
        name: "StoroConfirmVerifyAccount",
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
        name: "StoroPasswordReset",
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
        name: "StoroConfirmPasswordReset",
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
    name: "StoroLogout",
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
