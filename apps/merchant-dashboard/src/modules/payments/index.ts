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
        path: "/payment-links",
        name: "VesicashPaymentLinks",
        component: () =>
          import(
            /* webpackChunkName: "payments-module" */ "@/modules/payments/pages/payment-links.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Merchant Payment Links",
          pageMeta: {
            title: "Payment Links",
            description: "Merchant Payment Links",
          },
        },
      },
    ],
  },

  // Standalone payment link details page (no sidebar/layout)
  {
    path: "/payment-links/:id",
    name: "VesicashPaymentLinkDetails",
    component: () =>
      import(
        /* webpackChunkName: "payments-module" */ "@/modules/payments/pages/payment-link-details.vue"
      ),
    meta: {
      requiresAuth: false,
      title: "Payment Link Details",
      pageMeta: {
        title: "Payment Link Details",
        description: "Merchant Payment Link Details",
      },
    },
  },
  {
    path: "/payment-links/pay/:id",
    name: "VesicashMomoPayment",
    component: () =>
      import(
        /* webpackChunkName: "payments-module" */ "@/modules/payments/pages/payment-details.vue"
      ),
    meta: {
      requiresAuth: false,
      title: "Payment Details",
      pageMeta: {
        title: "Payment Details",
        description: "Merchant Payment Details",
      },
    },
  },
];

export default overviewRoutes;