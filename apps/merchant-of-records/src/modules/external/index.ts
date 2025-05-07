import { IRouteType } from "@packages/models";

// *********** REDSTONE EXTERNAL ROUTES *********** //
const externalRoutes: IRouteType[] = [
  {
    path: "/onboarding/aggregator-merchant",
    name: "MerchntAggregatorQuestionnaire",
    component: () =>
      import(
        /* webpackChunkName: "external-module" */ "@/modules/external/pages/questionnaire.vue"
      ),
    meta: {
      open: true,
      title: "Aggregator Questionnaire",
    },
  },

];

export default externalRoutes;

