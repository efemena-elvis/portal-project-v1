import { IRouteType } from "@packages/models";

// *********** VESICASH SETTINGS ROUTES *********** //
const overviewRoutes: IRouteType[] = [
  {
    path: "/settings",
    component: () =>
      import(
        /* webpackChunkName: "settings-layout" */ "@/layouts/base-layout.vue"
      ),
    children: [
      {
        path: "",
        component: () =>
          import(
            /* webpackChunkName: "settings-layout" */ "@/modules/settings/layouts/settings-layout.vue"
          ),
        children: [
          // *********** VESICASH SETTINGS *********** //
          {
            path: "profile",
            name: "VesicashProfile",
            component: () =>
              import(
                /* webpackChunkName: "settings-module" */ "@/modules/settings/pages/profile.vue"
              ),
            meta: {
              requiresAuth: true,
              title: "Merchant Profile",
              pageMeta: {
                title: "Settings - Profile",
                description: "Merchant Profile",
              },
            },
          },

          {
            path: "accounts",
            name: "VesicashBankAccount",
            component: () =>
              import(
                /* webpackChunkName: "settings-module" */ "@/modules/settings/pages/bank-account.vue"
              ),
            meta: {
              requiresAuth: true,
              title: "Merchant Bank Account",
              pageMeta: {
                title: "Settings - Bank Account",
                description: "Merchant Bank Account",
              },
            },
          },

          {
            path: "developer",
            name: "VesicashDeveloper",
            component: () =>
              import(
                /* webpackChunkName: "settings-module" */ "@/modules/settings/pages/developer.vue"
              ),
            meta: {
              requiresAuth: true,
              title: "Merchant Developer",
              pageMeta: {
                title: "Settings - Developer",
                description: "Merchant Developer",
              },
            },
          },
        ],
      },
    ],
  },
];

export default overviewRoutes;
