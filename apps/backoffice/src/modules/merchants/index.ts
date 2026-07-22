import { IRouteType } from "@packages/models";
import BaseLayout from "@/layouts/base-layout.vue";
import MerchantsPage from "@/modules/merchants/pages/merchants.vue";
import MerchantDetailsPage from "@/modules/merchants/pages/merchant-details.vue";

const merchantsRoutes: IRouteType[] = [
  {
    path: "/transactions",
    component: BaseLayout,
    children: [
      {
        path: "/merchants",
        name: "VesicashMerchants",
        component: MerchantsPage,
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
        component: MerchantDetailsPage,
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
