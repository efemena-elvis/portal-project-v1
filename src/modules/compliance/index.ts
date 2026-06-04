import { IRouteType } from "@packages/models";
import { FullPageLayout } from "@packages/uikit";

// *********** VESICASH COMPLIANCE ROUTES *********** //
const complianceRoutes: IRouteType[] = [
  // Compliance dashboard (with sidebar)
  {
    path: "/compliance",
    component: () =>
      import(
        /* webpackChunkName: "compliance-layout" */ "@/layouts/base-layout.vue"
      ),
    children: [
      {
        path: "",
        name: "VesicashCompliance",
        component: () =>
          import(
            /* webpackChunkName: "compliance-module" */ "@/modules/compliance/pages/compliance-dashboard.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Compliance",
          pageMeta: {
            title: "Compliance",
            description: "Vesicash portal compliance dashboard",
          },
        },
      },
      {
        path: "details/:id",
        name: "ComplianceDetails",
        component: () =>
          import(
            /* webpackChunkName: "compliance-module" */ "@/modules/compliance/pages/compliance-details.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Compliance Details",
          pageMeta: {
            title: "Compliance Details",
            description: "Vesicash portal compliance details",
          },
        },
      },
    ],
  },
];

export default complianceRoutes;
