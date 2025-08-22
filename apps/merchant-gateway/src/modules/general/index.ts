import { IRouteType } from "@packages/models";

const generalRoutes: IRouteType[] = [
  {
    path: "/",
    component: () =>
      import(/* webpackChunkName: "general-layout" */ "@/layouts/general.vue"),
    children: [
      {
        path: "",
        component: () =>
          import(
            /* webpackChunkName: "general-navigation-page" */ "@/modules/general/pages/navigation.vue"
          ),
        name: "CheckoutNavigationPage",
        meta: {
          title: "Navigation",
          guest: true,
        },
      },
    ],
  },
];

export default generalRoutes;
