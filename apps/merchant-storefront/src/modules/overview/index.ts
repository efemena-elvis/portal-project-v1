import { IRouteType } from "@packages/models";
import { FullPageLayout } from "@packages/uikit";

// *********** STORO OVERVIEW ROUTES *********** //
const overviewRoutes: IRouteType[] = [
  {
    path: "/overview",
    component: () =>
      import(
        /* webpackChunkName: "overview-layout" */ "@/layouts/base-layout.vue"
      ),
    children: [
      // *********** STORO OVERVIEW *********** //
      {
        path: "",
        name: "StoroOverview",
        component: () =>
          import(
            /* webpackChunkName: "overview-module" */ "@/modules/overview/pages/overview.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Dashboard Overview",
          pageMeta: {
            title: "Dashboard Overview",
            description: "Welcome to Storo",
          },
        },
      },
    ],
  },
];

export default overviewRoutes;
