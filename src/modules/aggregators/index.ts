import { IRouteType } from "@packages/models";
import BaseLayout from "@/layouts/base-layout.vue";
import AggregatorsPage from "@/modules/aggregators/pages/aggregators.vue";
import AggregatorDetailsPage from "@/modules/aggregators/pages/aggregator-details.vue";

const aggregatorsRoutes: IRouteType[] = [
  {
    path: "/aggregators",
    component: BaseLayout,
    children: [
      {
        path: "",
        name: "VesicashAggregators",
        component: AggregatorsPage,
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
        component: AggregatorDetailsPage,
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
