import { IRouteType } from "@packages/models";

const fundingRoutes: IRouteType[] = [
  {
    path: "/funding",
    component: () =>
      import(
        /* webpackChunkName: "funding-layout" */ "@/layouts/base-layout.vue"
      ),
    children: [
      {
        path: "",
        name: "VesicashFunding",
        component: () =>
          import(
            /* webpackChunkName: "funding-module" */ "@/modules/funding/pages/funding.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Funding",
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
