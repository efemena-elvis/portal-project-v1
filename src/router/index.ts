import { createRouter, createWebHistory } from "vue-router";
import middlewares from "@/middlewares";

// IMPORTED ROUTES FROM RESPECTIVE APPLICATION MODULES
import authRoutes from "@/modules/auth";

import paymentRoutes from "@/modules/payments";
import merchantsRoutes from "@/modules/merchants";
import balancesRoutes from "@/modules/balances";
import complianceRoutes from "@/modules/compliance";
import externalRoutes from "@/modules/external";
import overviewRoutes from "@/modules/overview";
import aggregatorsRoutes from "@/modules/aggregators";
import disputesRoutes from "@/modules/disputes";
import fundingRoutes from "@/modules/fundings";
import feesRoutes from "@/modules/fees";
import manageTeamsRoutes from "@/modules/manage-teams";
import transactionsRoutes from "@/modules/transactions";

const routes: import("vue-router").RouteRecordRaw[] = [
  ...(authRoutes as any),
  ...(overviewRoutes as any),
  ...(paymentRoutes as any),
  ...(transactionsRoutes as any),
  ...(merchantsRoutes as any),
  ...(balancesRoutes as any),
  ...(complianceRoutes as any),
  ...(externalRoutes as any),
  ...(aggregatorsRoutes as any),
  ...(disputesRoutes as any),
  ...(fundingRoutes as any),
  ...(feesRoutes as any),
  ...(manageTeamsRoutes as any),

  {
    path: "/:pathMatch(.*)*",
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
