import { IRouteType } from "@packages/models";
import { FullPageLayout } from "@packages/uikit";

// *********** OVERVIEW ROUTES *********** //
const overviewRoutes: IRouteType[] = [
  {
    path: "/overview",
    component: () =>
      import(
        /* webpackChunkName: "overview-layout" */ "@/layouts/base-layout.vue"
      ),
    children: [
      // *********** OVERVIEW *********** //
      {
        path: "",
        name: "VesicashOverview",
        component: () =>
          import(
            /* webpackChunkName: "overview-module" */ "@/modules/overview/pages/overview.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Dashboard Overview",
          pageMeta: {
            title: "Overview",
            description: "Welcome to Merchant Dashboard",
          },
        },
      },
    ],
  },
];

export default overviewRoutes;
