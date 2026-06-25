import { IRouteType } from "@packages/models";
import BaseLayout from "@/layouts/base-layout.vue";
import FeesPage from "@/modules/fees/pages/fees.vue";

const feesRoutes: IRouteType[] = [
  {
    path: "/fees",
    component: BaseLayout,
    children: [
      {
        path: "",
        name: "VesicashFees",
        component: FeesPage,
        meta: {
          requiresAuth: true,
          title: "Fees",
          pageMeta: {
            title: "Fees",
            description: "Fees",
          },
        },
      },
    ],
  },
];

export default feesRoutes;
