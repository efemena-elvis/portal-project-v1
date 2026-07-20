import { IRouteType } from "@packages/models";
import BaseLayout from "@/layouts/base-layout.vue";

const overviewRoutes: IRouteType[] = [
  {
    path: "/transactions",
    component: BaseLayout,
    children: [],
  },
];

export default overviewRoutes;
