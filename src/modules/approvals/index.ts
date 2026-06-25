import { IRouteType } from "@packages/models";
import BaseLayout from "@/layouts/base-layout.vue";
import ApprovalsPage from "@/modules/approvals/pages/approvals.vue";

const approvalRoutes: IRouteType[] = [
  {
    path: "/approvals",
    component: BaseLayout,
    children: [
      {
        path: "",
        name: "VesicashApprovals",
        component: ApprovalsPage,
        meta: {
          requiresAuth: true,
          title: "Approvals",
          pageMeta: {
            title: "Approvals",
            description: "Approve funding and withdrawal requests",
          },
        },
      },
    ],
  },
];

export default approvalRoutes;
