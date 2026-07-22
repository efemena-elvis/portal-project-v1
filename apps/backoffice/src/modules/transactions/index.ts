import { IRouteType } from "@packages/models";
import BaseLayout from "@/layouts/base-layout.vue";
import TransactionsPage from "@/modules/transactions/pages/transactions.vue";

const transactionsRoutes: IRouteType[] = [
  {
    path: "/admin-transactions",
    component: BaseLayout,
    children: [
      {
        path: "",
        name: "VesicashTransactions",
        component: TransactionsPage,
        meta: {
          requiresAuth: true,
          title: "Transactions",
          pageMeta: {
            title: "Transactions",
            description: "Transactions",
          },
        },
      },
    ],
  },
];

export default transactionsRoutes;
