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
    ],
  },

  {
    path: "/verify-account",
    component: () =>
      import(
        /* webpackChunkName: "auth-layout" */ "@/modules/auth/layouts/auth-layout.vue"
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
