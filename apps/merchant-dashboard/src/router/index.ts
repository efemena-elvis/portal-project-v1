import { createRouter, createWebHistory } from "vue-router";
import middlewares from "@/middlewares";

// IMPORTED ROUTES FROM RESPECTIVE APPLICATION MODULES
import authRoutes from "@/modules/auth";

import paymentRoutes from "@/modules/payments";
import balancesRoutes from "@/modules/balances";
import complianceRoutes from "@/modules/compliance";
import settingsRoutes from "@/modules/settings";
import overviewRoutes from "@/modules/overview";
import checkoutRoutes from "@/modules/checkout";
import storefrontRoutes from "@/modules/storefront";

const routes = [
  ...authRoutes,
  ...overviewRoutes,
  ...paymentRoutes,
  ...balancesRoutes,
  ...complianceRoutes,
  ...settingsRoutes,
  ...checkoutRoutes,
  ...storefrontRoutes,

  {
    path: "/*",
    name: "NotFoundError",
    component: () =>
      import(
        /* webpackChunkName: "errorRoute" */
        "@/modules/error/pages/not-found.vue"
      ),
    meta: {
      open: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth",
      };
    } else if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  },
});

// =============================================================
// WRAPPING OUR APPLICATION ENTRY POINTS INSIDE OUR MIDDLEWARE
// TO VERIFY A USER AUTHENTICATION STATE AND AUTHORIZATION
// =============================================================
router.beforeEach(async (to, from, next) => middlewares(to, from, next));
export default router;
