import { IRouteType } from "@packages/models";

// *********** ALEXPAY CHECKOUT ROUTES *********** //
const checkoutRoutes: IRouteType[] = [
  {
    path: "/checkout",
    name: "AlexPayCheckout",
    children: [
      {
        path: ":reference",
        name: "AlexPayCheckoutReference",
        component: () =>
          import(
            /* webpackChunkName: "checkout" */ "@/modules/checkout/pages/checkout.vue"
          ),
        meta: {
          public: true,
          title: "Checkout",
        },
      },
    ],
  },
];

export default checkoutRoutes;
