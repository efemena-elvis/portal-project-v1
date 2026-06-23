import { IRouteType } from "@packages/models";

const overviewRoutes: IRouteType[] = [
  {
    path: "/transactions",
    component: () =>
      import(
        /* webpackChunkName: "pyments-layout" */ "@/layouts/base-layout.vue"
      ),
    children: [],
  },
];

export default overviewRoutes;
