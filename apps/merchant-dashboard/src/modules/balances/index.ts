import { IRouteType } from "@packages/models";

// *********** VESICASH BALANCES ROUTES *********** //
const overviewRoutes: IRouteType[] = [
  {
    path: "/balance-history",
    component: () =>
      import(
        /* webpackChunkName: "balances-layout" */ "@/layouts/base-layout.vue"
      ),
    children: [
      // *********** VESICASH BALANCES *********** //
      {
        path: "",
        name: "VesicashBalanceHistory",
        component: () =>
          import(
            /* webpackChunkName: "balances-module" */ "@/modules/balances/pages/balance-history.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Balance History",
          pageMeta: {
            title: "Balance History",
            description: "Merchant Balance History",
          },
        },
      },

      {
        path: "/payouts",
        name: "VesicashPayouts",
        component: () =>
          import(
            /* webpackChunkName: "balances-module" */ "@/modules/balances/pages/payouts.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Merchant Payouts",
          pageMeta: {
            title: "Payouts",
            description: "Merchant Payouts",
          },
        },
      },
    ],
  },
];

export default overviewRoutes;
