import { IRouteType } from "@packages/models";
import { FullPageLayout } from "@packages/uikit";

export function getOverviewRoutes(morAccountType: string ): IRouteType[] {
  const baseLayout = {
    path: "/overview",
    component: () =>
      import(/* webpackChunkName: "overview-layout" */ "@/layouts/base-layout.vue"),
    children: [
      morAccountType === "merchant"
        ? {
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
          }
        : {
            path: "",
            name: "AggregatorOverview",
            component: () =>
              import(
                /* webpackChunkName: "overview-module" */ "@/modules/overview/pages/aggregator/overview.vue"
              ),
            meta: {
              requiresAuth: true,
              title: "Dashboard Overview-Aggregator",
              pageMeta: {
                title: "Aggregator Overview",
                description: "Welcome to Vesicash MoR",
              },
            },
          },
    ],
  };

  const walletRoutes = {
    path: "/market",
    component: () => Promise.resolve(FullPageLayout),
    children: [
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
  };

  return [baseLayout, walletRoutes];
}
