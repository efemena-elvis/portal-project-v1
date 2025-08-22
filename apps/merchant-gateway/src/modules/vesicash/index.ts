import { IRouteType } from "@packages/models";

// *********** VESICASH CHECKOUT ROUTES *********** //
const checkoutRoutes: IRouteType[] = [
  {
    path: "/vesicash",
    component: () =>
      import(/* webpackChunkName: "checkout-layout" */ "@/layouts/default.vue"),
    children: [
      // *********** VESICASH CHECKOUT PAGE *********** //
      {
        path: "checkout",
        name: "VesicashCheckout",
        children: [
          {
            path: "payment",
            name: "VesicashCheckoutPayment",
            component: () =>
              import(
                /* webpackChunkName: "checkout-payment" */ "@/modules/vesicash/pages/payment.vue"
              ),
            meta: {
              guest: true,
              title: "Complete Payment",
            },
          },
        ],
      },
    ],
  },
];

export default checkoutRoutes;
