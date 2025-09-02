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
            path: "domains",
            name: "VesicashDomains",
            component: () =>
              import(
                /* webpackChunkName: "settings-module" */ "@/modules/settings/pages/domains.vue"
              ),
            meta: {
              requiresAuth: true,
              title: "Merchant Domains",
              pageMeta: {
                title: "Settings - Domains",
                description: "Merchant Domains",
              },
            },
          },
          {
            path: "developers",
            name: "VesicashDevelopers",
            component: () =>
              import(
                /* webpackChunkName: "settings-module" */ "@/modules/settings/pages/developers.vue"
              ),
            meta: {
              requiresAuth: true,
              title: "Merchant Developers",
              pageMeta: {
                title: "Settings - Developers",
                description: "Merchant Developers",
              },
            },
          },
        ],
      },
    ],
  },
];

export default overviewRoutes;
