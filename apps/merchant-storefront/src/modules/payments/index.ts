import { IRouteType } from "@packages/models";

// *********** PAYMENTS ROUTES *********** //
const overviewRoutes: IRouteType[] = [
  {
    path: "/transactions",
  
    component: () =>
      import(
        /* webpackChunkName: "payments-layout" */ "@/layouts/base-layout.vue"
      ),
    children: [
      // *********** PAYMENTS *********** //
      {
        path: "",
        name: "StoroTransactions",
        component: () =>
          import(
            /* webpackChunkName: "payments-module" */ "@/modules/payments/pages/transactions.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Store Transactions",
          pageMeta: {
            title: "All Transactions",
            description: "Store Transactions",
          },
        },
      },

      {
        path: "/balance-history",
        name: "StoroBalanceHistory",
        component: () =>
          import(
            /* webpackChunkName: "balances-module" */ "@/modules/payments/pages/balance-history.vue"
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
        name: "StoroPayouts",
        component: () =>
          import(
            /* webpackChunkName: "payments-module" */ "@/modules/payments/pages/settlements.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Merchant Payouts",
          pageMeta: {
            title: "Store Payouts",
            description: "Merchant Payouts",
          },
        },
      },
    ],
  },
];

export default overviewRoutes;
