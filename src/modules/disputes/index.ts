import { IRouteType } from "@packages/models";

const disputesRoutes: IRouteType[] = [
  {
    path: "/disputes",
    component: () =>
      import(
        /* webpackChunkName: "disputes-layout" */ "@/layouts/base-layout.vue"
      ),
    children: [
      {
        path: "",
        name: "VesicashDisputes",
        component: () =>
          import(
            /* webpackChunkName: "disputes-module" */ "@/modules/disputes/pages/disputes.vue"
          ),
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
