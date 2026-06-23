import { IRouteType } from "@packages/models";

const merchantsRoutes: IRouteType[] = [
  {
    path: "/transactions",
    component: () =>
      import(
        /* webpackChunkName: "merchants-layout" */ "@/layouts/base-layout.vue"
      ),
    children: [
      {
        path: "/merchants",
        name: "VesicashMerchants",
        component: () =>
          import(
            /* webpackChunkName: "merchants-module" */ "@/modules/merchants/pages/merchants.vue"
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
      {
        path: "/merchant/:id",
        name: "MerchantDetails",
        component: () =>
          import(
            /* webpackChunkName: "merchants-module" */ "@/modules/merchants/pages/merchant-details.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Merchant's Details",
          pageMeta: {
            title: "Merchant's Details",
            description: "Merchant's Details",
          },
        },
      },
    ],
  },
];

export default merchantsRoutes;
