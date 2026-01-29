import { IRouteType } from "@packages/models";

const storefrontRoutes: IRouteType[] = [
  {
    path: "/storefront",
    component: () =>
      import(/* webpackChunkName: "base-layout" */ "@/layouts/base-layout.vue"),
    children: [
      {
        path: "",
        name: "RedstoneStorefront",
        component: () =>
          import(
            /* webpackChunkName: "storefront-module" */ "@/modules/storefront/pages/storefront-list.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Storefront",
          pageMeta: {
            title: "Merchant Storefront",
            description: "Create and manage all existing storefront",
          },
        },
      },

    //   {
    //     path: "",
    //     component: () =>
    //       import(
    //         /* webpackChunkName: "storefront-module" */ "@/modules/storefront/layouts/manage-storefront-layout.vue"
    //       ),
    //     children: [
    //       {
    //         path: "overview/:storeId",
    //         name: "RedstoneStorefrontOverview",
    //         component: () =>
    //           import(
    //             /* webpackChunkName: "storefront-module" */ "@/modules/storefront/pages/store-overview.vue"
    //           ),
    //         meta: {
    //           requiresAuth: true,
    //           title: "Storefront Overview",
    //           pageMeta: {
    //             title: "Storefront Overview",
    //             description: "Manage the details of a specific storefront",
    //           },
    //         },
    //       },

    //       {
    //         path: "products/:storeId",
    //         name: "RedstoneStorefrontProducts",
    //         component: () =>
    //           import(
    //             /* webpackChunkName: "storefront-module" */ "@/modules/storefront/pages/store-products.vue"
    //           ),
    //         meta: {
    //           requiresAuth: true,
    //           title: "Storefront Products",
    //           pageMeta: {
    //             title: "Storefront Products",
    //             description: "Create and manage your store's products",
    //           },
    //         },
    //       },

    //       {
    //         path: "orders/:storeId",
    //         name: "RedstoneStorefrontOrders",
    //         component: () =>
    //           import(
    //             /* webpackChunkName: "storefront-module" */ "@/modules/storefront/pages/store-orders.vue"
    //           ),
    //         meta: {
    //           requiresAuth: true,
    //           title: "Storefront Orders",
    //           pageMeta: {
    //             title: "Storefront Orders",
    //             description: "Manage and engage with your store's orders",
    //           },
    //         },
    //       },

    //       {
    //         path: "custom-domain/:storeId",
    //         name: "RedstoneStorefrontDomains",
    //         component: () =>
    //           import(
    //             /* webpackChunkName: "storefront-module" */ "@/modules/storefront/pages/store-custom-domains.vue"
    //           ),
    //         meta: {
    //           requiresAuth: true,
    //           title: "Custom Domain",
    //           pageMeta: {
    //             title: "Custom Domain",
    //             description: "Create and manage your custom domain",
    //           },
    //         },
    //       },
    //     ],
    //   },
    ],
  },
];

export default storefrontRoutes;
