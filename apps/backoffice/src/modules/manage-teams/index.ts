import { IRouteType } from "@packages/models";
import BaseLayout from "@/layouts/base-layout.vue";
import ManageTeamsPage from "@/modules/manage-teams/pages/manage-teams.vue";
import RolesPage from "@/modules/manage-teams/pages/roles.vue";
import ActivitiesPage from "@/modules/manage-teams/pages/activities.vue";

const manageTeamsRoutes: IRouteType[] = [
  {
    path: "/manage-teams",
    component: BaseLayout,
    children: [
      {
        path: "",
        name: "VesicashManageTeams",
        component: ManageTeamsPage,
        meta: {
          requiresAuth: true,
          title: "Manage Teams",
          pageMeta: {
            title: "Manage Teams",
            description: "Manage Teams",
          },
        },
      },
      {
        path: "roles",
        name: "VesicashManageTeamsRoles",
        component: RolesPage,
        meta: {
          requiresAuth: true,
          title: "Manage Roles",
          pageMeta: {
            title: "Manage Roles",
            description: "Manage Roles",
          },
        },
      },
      {
        path: "activities",
        name: "VesicashManageTeamsActivities",
        component: ActivitiesPage,
        meta: {
          requiresAuth: true,
          title: "Team Activities",
          pageMeta: {
            title: "Team Activities",
            description: "Team Activities",
          },
        },
      },
    ],
  },
];

export default manageTeamsRoutes;
