import { IRouteType } from "@packages/models";
import BaseLayout from "@/layouts/base-layout.vue";
import DisputesPage from "@/modules/disputes/pages/disputes.vue";

const disputesRoutes: IRouteType[] = [
  {
    path: "/disputes",
    component: BaseLayout,
    children: [
      {
        path: "",
        name: "VesicashDisputes",
        component: DisputesPage,
        meta: {
          requiresAuth: true,
          title: "Disputes",
          pageMeta: {
            title: "Disputes",
            description: "Disputes",
          },
        },
      },
    ],
  },
];

export default disputesRoutes;
