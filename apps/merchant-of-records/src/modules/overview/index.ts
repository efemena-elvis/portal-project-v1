import { IRouteType } from "@packages/models";
import { FullPageLayout } from "@packages/uikit";

// *********** VESICASH OVERVIEW ROUTES *********** //
const overviewRoutes: IRouteType[] = [
  {
    path: "/overview",
    component: () =>
      import(
        /* webpackChunkName: "overview-layout" */ "@/layouts/base-layout.vue"
      ),
    children: [
      // *********** VESICASH OVERVIEW *********** //
      {
        path: "",
        name: "VesicashOverview",
        component: () =>
          import(
            /* webpackChunkName: "overview-module" */ "@/modules/overview/pages/overview.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Dashboard Overview",
          pageMeta: {
            title: "Overview",
            description: "Welcome to Vesicash MoR",
          },
        },
      },
    ],
  },

  {
    path: "/market",
    component: () => Promise.resolve(FullPageLayout),
    children: [
      // *********** WALLET ENTRY *********** //
      {
        path: "wallet-entry",
        name: "VesicashWalletEntry",
        component: () =>
          import(
            /* webpackChunkName: "overview-module" */ "@/modules/overview/pages/create-wallet/wallet-entry.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Adding a collection currency",
          pageMeta: {
            title: "Entry-Wallet",
            description: "Vesicash MoR market wallet entry",
          },
        },
      },

      // *********** WALLET DOCUMENT *********** //
      {
        path: "wallet-document",
        name: "VesicashWalletDocument",
        component: () =>
          import(
            /* webpackChunkName: "overview-module" */ "@/modules/overview/pages/create-wallet/wallet-document.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Adding a collection currency",
          pageMeta: {
            title: "Document-Wallet",
            description: "Vesicash MoR market documents",
          },
        },
      },

      // *********** WALLET STATUS *********** //
      {
        path: "wallet-status",
        name: "VesicashWalletStatus",
        component: () =>
          import(
            /* webpackChunkName: "overview-module" */ "@/modules/overview/pages/create-wallet/wallet-status.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Adding a collection currency",
          pageMeta: {
            title: "Status-Wallet",
            description: "Vesicash MoR market status",
          },
        },
      },
    ],
  },
];

export default overviewRoutes;