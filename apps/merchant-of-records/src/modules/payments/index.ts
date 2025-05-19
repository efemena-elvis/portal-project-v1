/* This TypeScript code snippet is defining an array of route objects for Vesicash payments within a
web application. Each route object contains information such as the path, component to render, child
routes, and metadata like authentication requirements and page titles. */
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
      {
        path: "/merchants",
        name: "VesicashRefunds",
        component: () =>
          import(
            /* webpackChunkName: "payments-module" */ "@/modules/payments/pages/merchants.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Merchants",
          pageMeta: {
            title: "Merchants",
            description: "Merchants",
          },
        },
      },
    ],
  },
];

export default overviewRoutes;
