import { IRouteType } from "@packages/models";
import BaseLayout from "@/layouts/base-layout.vue";
import WithdrawalRequestsPage from "@/modules/balances/pages/withdrawal-requests.vue";

// *********** VESICASH BALANCES ROUTES *********** //
const overviewRoutes: IRouteType[] = [
  {
    path: "/balance-history",
    component: BaseLayout,
    children: [
      {
        path: "/withdrawal-requests",
        name: "WithdrawalRequests",
        component: WithdrawalRequestsPage,
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
