import { IRouteType } from "@packages/models";

const feesRoutes: IRouteType[] = [
  {
    path: "/fees",
    component: () =>
      import(/* webpackChunkName: "fees-layout" */ "@/layouts/base-layout.vue"),
    children: [
      {
        path: "",
        name: "VesicashFees",
        component: () =>
          import(
            /* webpackChunkName: "fees-module" */ "@/modules/fees/pages/fees.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Fees",
          pageMeta: {
            title: "Fees",
            description: "Fees",
          },
        },
      },
    ],
  },
];

export default feesRoutes;
