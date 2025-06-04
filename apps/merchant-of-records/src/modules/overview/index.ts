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

  {
    path: "/merchant",
    component: () => Promise.resolve(FullPageLayout),
    children: [
      {
        path: "add",
        name: "AddMerchants",
        component: () =>
          import(
            /* webpackChunkName: "overview-module" */ "@/modules/overview/pages/aggregator/merchant-onboarding.vue"
          ),
          meta: {
          requiresAuth: true,
          title: "Merchants Onboarding",
          pageMeta: {
            title: "Add-Merchants",
            description: "Adding and uploading merchants",
          },
          
        },

       },
      {
        path: "business-profile",
        name: "MerchantBusinessProfile",
        component: () =>
          import(
            /* webpackChunkName: "overview-module" */ "@/modules/overview/components/aggregator/onboarding-form-comp/business-profile.vue"
          ),
          meta: {
          requiresAuth: true,
          title: "Merchants Onboarding",
          pageMeta: {
            title: "Business-Profile",
            description: "Vesicash merchant's profile",
          },
          
        },

       },
      {
        path: "director-details",
        name: "DirectorDetails1",
        component: () =>
          import(
            /* webpackChunkName: "overview-module" */ "@/modules/overview/components/aggregator/onboarding-form-comp/director-profile.vue"
          ),
          meta: {
          requiresAuth: true,
          title: "Merchants Onboarding",
          pageMeta: {
            title: "Director1-Details",
            description: "Vesicash director's details",
          },
          
        },

       },
      {
        path: "director2-details",
        name: "DirectorDetails2",
        component: () =>
          import(
            /* webpackChunkName: "overview-module" */ "@/modules/overview/components/aggregator/onboarding-form-comp/director-profile.vue"
          ),
          meta: {
          requiresAuth: true,
          title: "Merchants Onboarding",
          pageMeta: {
            title: "Director2-Details",
            description: "Vesicash director's details",
          },
          
        },

       },
      {
        path: "ultimate-business-owner",
        name: "UboDetails1",
        component: () =>
          import(
            /* webpackChunkName: "overview-module" */ "@/modules/overview/components/aggregator/onboarding-form-comp/ultimate-business-owner.vue"
          ),
          meta: {
          requiresAuth: true,
          title: "Merchants Onboarding",
          pageMeta: {
            title: "UBO1-Details",
            description: "Vesicash ultimate business owner",
          },
          
        },

       },
      {
        path: "ultimate-business-owner2",
        name: "UboDetails2",
        component: () =>
          import(
            /* webpackChunkName: "overview-module" */ "@/modules/overview/components/aggregator/onboarding-form-comp/ultimate-business-owner.vue"
          ),
          meta: {
          requiresAuth: true,
          title: "Merchants Onboarding",
          pageMeta: {
            title: "UBO2-Details",
            description: "Vesicash ultimate business owner",
          },
          
        },

       },
      {
        path: "business-address",
        name: "MerchantBusinessAddress",
        component: () =>
          import(
            /* webpackChunkName: "overview-module" */ "@/modules/overview/components/aggregator/onboarding-form-comp/business-address.vue"
          ),
          meta: {
          requiresAuth: true,
          title: "Merchants Onboarding",
          pageMeta: {
            title: "Address",
            description: "Vesicash merchant's address",
          },
          
        },

       },
      {
        path: "business-documents",
        name: "BusinessDocuments",
        component: () =>
          import(
            /* webpackChunkName: "overview-module" */ "@/modules/overview/components/aggregator/onboarding-form-comp/business-documents.vue"
          ),
          meta: {
          requiresAuth: true,
          title: "Merchants Onboarding",
          pageMeta: {
            title: "Registration-Documents",
            description: "Vesicash merchant's business documents",
          },
          
        },

       },
     

        {
        path: "add-merchant-status",
        name: "VesicashAddMerchantStatus",
        component: () =>
          import(
            /* webpackChunkName: "overview-module" */ "@/modules/overview/pages/aggregator/add-merchant-status.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Adding merchants",
          pageMeta: {
            title: "Status-Sdd-Merchant",
            description: "Vesicash merchant addition status",
          },
        },
      },

    ],
  },
];

export default overviewRoutes;
