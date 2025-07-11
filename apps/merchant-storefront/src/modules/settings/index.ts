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
            path: "custom-domain",
            name: "VesicashCustomDomain",
            component: () =>
              import(
                /* webpackChunkName: "settings-module" */ "@/modules/settings/pages/custom-domain.vue"
              ),
            meta: {
              requiresAuth: true,
              title: "Merchant Custom Domain",
              pageMeta: {
                title: "Settings - Custom Domain",
                description: "Merchant Custom Domain",
              },
            },
          },
        ],
      },
    ],
  },
];

export default overviewRoutes;
