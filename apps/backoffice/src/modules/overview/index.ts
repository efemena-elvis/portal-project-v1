import { IRouteType } from "@packages/models";
import BaseLayout from "@/layouts/base-layout.vue";
import OverviewPage from "@/modules/overview/pages/overview.vue";

// *********** VESICASH OVERVIEW ROUTES *********** //
const overviewRoutes: IRouteType[] = [
  {
    path: "/overview",
    component: BaseLayout,
    children: [
      {
        path: "",
        name: "VesicashOverview",
        component: OverviewPage,
        meta: {
          requiresAuth: true,
          title: "Dashboard Overview",
          pageMeta: {
            title: "Overview",
            description: "Welcome to Vesicash MoR",
          },
        },
      },
    ],
  },
];

export default overviewRoutes;
