import { IRouteType } from "@packages/models";
import { FullPageLayout } from "@packages/uikit";

// *********** STOREFRONT ROUTES *********** //
const storefrontRoutes: IRouteType[] = [
  {
    path: "/storefront",
    component: () => Promise.resolve(FullPageLayout),
    children: [
      // *********** STOREFRONT CREATE ROUTES *********** //
      {
        path: "create",
        name: "StorefrontCreate",
        component: () =>
          import(
            /* webpackChunkName: "storefront-module" */ "@/modules/storefront/pages/create-storefront.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Create Storefront",
          pageMeta: {
            title: "Create-Storefront",
            description: "Storefront creation setup",
          },
        },
      },

      {
        path: "create-successful",
        name: "StorefrontCreateSuccessful",
        component: () =>
          import(
            /* webpackChunkName: "storefront-module" */ "@/modules/storefront/pages/create-storefront-success.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Storefront Created Successfully",
          pageMeta: {
            title: "Storefront Created",
            description: "Storefront created successfully",
          },
        },
      },

      // *********** STOREFRONT SETUP ROUTES *********** //
      {
        path: "setup/store-details",
        name: "SetupStoreDetails",
        component: () =>
          import(
            /* webpackChunkName: "storefront-module" */ "@/modules/storefront/pages/store-setup/store-details.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Setup Storefront",
          pageMeta: {
            title: "Store-Details",
            description: "Storefront setup - store details",
          },
        },
      },

      {
        path: "setup/contact-details",
        name: "SetupContactDetails",
        component: () =>
          import(
            /* webpackChunkName: "storefront-module" */ "@/modules/storefront/pages/store-setup/contact-details.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Setup Storefront",
          pageMeta: {
            title: "Contact-Details",
            description: "Storefront setup - contact details",
          },
        },
      },

      {
        path: "setup/payment-details",
        name: "SetupPaymentDetails",
        component: () =>
          import(
            /* webpackChunkName: "storefront-module" */ "@/modules/storefront/pages/store-setup/payment-details.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Setup Storefront",
          pageMeta: {
            title: "Payment-Details",
            description: "Storefront setup - payment details",
          },
        },
      },

      {
        path: "setup/identification-details",
        name: "SetupIdentificationDetails",
        component: () =>
          import(
            /* webpackChunkName: "storefront-module" */ "@/modules/storefront/pages/store-setup/identification-details.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Setup Storefront",
          pageMeta: {
            title: "Identification-Details",
            description: "Storefront setup - identification details",
          },
        },
      },
    ],
  },

  {
    path: "",
    component: () => Promise.resolve(FullPageLayout),
    children: [
      // *********** CREATE PRODUCT ROUTE *********** //
      {
        path: "/products/create",
        name: "AddStoreProduct",
        component: () =>
          import(
            /* webpackChunkName: "storefront-module" */ "@/modules/storefront/pages/add-product.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Add Product",
          pageMeta: {
            title: "Add New Product",
            description: "Add a new product for your store",
          },
        },
      },
    ],
  },

  {
    path: "/customers",
    component: () =>
      import(
        /* webpackChunkName: "storefront-layout" */ "@/layouts/base-layout.vue"
      ),
    children: [
      {
        path: "",
        name: "StoroCustomers",
        component: () =>
          import(
            /* webpackChunkName: "storefront-module" */ "@/modules/storefront/pages/customer-list.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Merchant Customers",
          pageMeta: {
            title: "All Customers",
            description: "Merchant Customers",
          },
        },
      },

      {
        path: "/products",
        name: "StoroProducts",
        component: () =>
          import(
            /* webpackChunkName: "storefront-module" */ "@/modules/storefront/pages/product-list.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Merchant Products",
          pageMeta: {
            title: "Store Products",
            description: "Merchant Products",
          },
        },
      },

      {
        path: "/orders",
        name: "StoroOrders",
        component: () =>
          import(
            /* webpackChunkName: "storefront-module" */ "@/modules/storefront/pages/order-list.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Merchant Orders",
          pageMeta: {
            title: "Customer Orders",
            description: "Merchant Orders",
          },
        },
      },
    ],
  },
];

export default storefrontRoutes;
