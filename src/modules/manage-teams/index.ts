import { IRouteType } from "@packages/models";

const manageTeamsRoutes: IRouteType[] = [
  {
    path: "/manage-teams",
    component: () =>
      import(
        /* webpackChunkName: "manage-teams-layout" */ "@/layouts/base-layout.vue"
      ),
    children: [
      {
        path: "",
        name: "VesicashManageTeams",
        component: () =>
          import(
            /* webpackChunkName: "manage-teams-module" */ "@/modules/manage-teams/pages/manage-teams.vue"
          ),
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
        component: () =>
          import(
            /* webpackChunkName: "manage-teams-roles" */ "@/modules/manage-teams/pages/roles.vue"
          ),
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
        component: () =>
          import(
            /* webpackChunkName: "manage-teams-activities" */ "@/modules/manage-teams/pages/activities.vue"
          ),
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
