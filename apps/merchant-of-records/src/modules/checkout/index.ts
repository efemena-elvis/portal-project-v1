import { IRouteType } from "@packages/models";

// *********** CHECKOUT ROUTES *********** //
const checkoutRoutes: IRouteType[] = [
  {
    path: "/test-checkout",
    children: [
      {
        path: ":reference",
        name: "VesicashCheckoutTest",
        component: () =>
          import(
            /* webpackChunkName: "checkout" */ "@/modules/checkout/pages/_checkout.vue"
          ),
        meta: {
          public: true,
          title: "Checkout",
        },
      },
    ],
  },
  {
    path: "/checkout",
    children: [
      {
        path: ":reference",
        name: "VesicashCheckout",
        component: () =>
          import(
            /* webpackChunkName: "checkout" */ "@/modules/checkout/pages/checkout.vue"
          ),
        meta: {
          public: true,
          title: "Checkout",
        },
      },
      {
        path: "payment-status",
        name: "VesicashCheckoutStatus",
        component: () =>
          import(
            /* webpackChunkName: "checkout" */ "@/modules/checkout/pages/checkout-status.vue"
          ),
        meta: {
          public: true,
          title: "Checkout Payment Status",
        },
      },
    ],
  },
];

export default checkoutRoutes;
