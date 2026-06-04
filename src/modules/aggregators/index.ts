import { IRouteType } from "@packages/models";

const aggregatorsRoutes: IRouteType[] = [
  {
    path: "/aggregators",
    component: () =>
      import(
        /* webpackChunkName: "aggregators-layout" */ "@/layouts/base-layout.vue"
      ),
    children: [
      {
        path: "",
        name: "VesicashAggregators",
        component: () =>
          import(
            /* webpackChunkName: "aggregators-module" */ "@/modules/aggregators/pages/aggregators.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Aggregators",
          pageMeta: {
            title: "Aggregators",
            description: "Aggregators",
          },
        },
      },
      {
        path: ":id",
        name: "AggregatorDetails",
        component: () =>
          import(
            /* webpackChunkName: "aggregators-module" */ "@/modules/aggregators/pages/aggregator-details.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Aggregator's Details",
          pageMeta: {
            title: "Aggregator's Details",
            description: "Aggregator's Details",
          },
        },
      },
    ],
  },
];

export default aggregatorsRoutes;
