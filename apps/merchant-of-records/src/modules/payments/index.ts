import { IRouteType } from "@packages/models";

// *********** VESICASH PAYMENTS ROUTES *********** //
const overviewRoutes: IRouteType[] = [
  {
    path: "/transactions",
    component: () =>
      import(
        /* webpackChunkName: "payments-layout" */ "@/layouts/base-layout.vue"
      ),
    children: [
      // *********** VESICASH PAYMENTS *********** //
      {
        path: "",
        name: "VesicashTransactions",
        component: () =>
          import(
            /* webpackChunkName: "payments-module" */ "@/modules/payments/pages/transactions.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Merchant Transactions",
          pageMeta: {
            title: "Transactions",
            description: "Merchant Transactions",
          },
        },
      },

      {
        path: "/tax-records",
        name: "VesicashTaxRecords",
        component: () =>
          import(
            /* webpackChunkName: "payments-module" */ "@/modules/payments/pages/tax-records.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Merchant Tax Records",
          pageMeta: {
            title: "Tax Records",
            description: "Merchant Tax Records",
          },
        },
      },

      {
        path: "/customers",
        name: "VesicashCustomers",
        component: () =>
          import(
            /* webpackChunkName: "payments-module" */ "@/modules/payments/pages/customers.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Merchant Customers",
          pageMeta: {
            title: "Customers",
            description: "Merchant Customers",
          },
        },
      },

      {
        path: "/refunds",
        name: "VesicashRefunds",
        component: () =>
          import(
            /* webpackChunkName: "payments-module" */ "@/modules/payments/pages/refunds.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Merchant Refunds",
          pageMeta: {
            title: "Refunds",
            description: "Merchant Refunds",
          },
        },
      },
    ],
  },
];

export default overviewRoutes;
