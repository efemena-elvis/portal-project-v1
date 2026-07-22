import { IRouteType } from "@packages/models";
import BaseLayout from "@/layouts/base-layout.vue";
import ComplianceDashboardPage from "@/modules/compliance/pages/compliance-dashboard.vue";
import ComplianceDetailsPage from "@/modules/compliance/pages/compliance-details.vue";

// *********** VESICASH COMPLIANCE ROUTES *********** //
const complianceRoutes: IRouteType[] = [
  {
    path: "/compliance",
    component: BaseLayout,
    children: [
      {
        path: "",
        name: "VesicashCompliance",
        component: ComplianceDashboardPage,
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
        component: ComplianceDetailsPage,
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
