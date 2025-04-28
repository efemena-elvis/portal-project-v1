import { IRouteType } from "@packages/models";

// *********** VESICASH OVERVIEW ROUTES *********** //
const overviewRoutes: IRouteType[] = [
  {
    path: "/overview",
    component: () =>
      import(
        /* webpackChunkName: "overview-layout" */ "@/layouts/base-layout.vue"
      ),
    children: [
      // *********** VESICASH OVERVIEW *********** //
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
            description: "Welcome to Vesicash MoR",
          },
        },
      },
    ],
  },
];

export default overviewRoutes;
