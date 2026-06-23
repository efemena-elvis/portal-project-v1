import { IRouteType } from "@packages/models";

const fundingRoutes: IRouteType[] = [
  {
    path: "/fundings",
    component: () =>
      import(
        /* webpackChunkName: "funding-layout" */ "@/layouts/base-layout.vue"
      ),
    children: [
      {
        path: "",
        name: "VesicashFundings",
        component: () =>
          import(
            /* webpackChunkName: "fundings-module" */ "@/modules/fundings/pages/fundings.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Fundings",
          pageMeta: {
            title: "Funding",
            description: "Funding",
          },
        },
      },
    ],
  },
];

export default fundingRoutes;
