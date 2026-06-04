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
        path: "/withdrawal-requests",
        name: "WithdrawalRequests",
        component: () =>
          import(
            /* webpackChunkName: "balances-module" */ "@/modules/balances/pages/withdrawal-requests.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Withdrawal Requests",
          pageMeta: {
            title: "Withdrawal Requests",
            description: "Withdrawal Requests",
          },
        },
      },
    ],
  },
];

export default overviewRoutes;
