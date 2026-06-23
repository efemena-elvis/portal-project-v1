import { IRouteType } from "@packages/models";

const transactionsRoutes: IRouteType[] = [
  {
    path: "/admin-transactions",
    component: () =>
      import(
        /* webpackChunkName: "transactions-layout" */ "@/layouts/base-layout.vue"
      ),
    children: [
      {
        path: "",
        name: "VesicashTransactions",
        component: () =>
          import(
            /* webpackChunkName: "transactions-module" */ "@/modules/transactions/pages/transactions.vue"
          ),
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
