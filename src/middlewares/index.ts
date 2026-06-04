// =============================================
// APPLICATION AUTHENTICATION MIDDLEWARE
// =============================================
import { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import { useRouteGuard } from "@packages/hooks";
import constants from "@/shared/utilities/constants";

const { MOR_AUTH_TOKEN } = constants;

/* CONFIGURATION */
const routeGuard = new useRouteGuard({
  tokenKey: MOR_AUTH_TOKEN,
  loginRoute: "VesicashLogin",
  logoutRoute: "VesicashLogout",
  dashboardRoute: "VesicashOverview",
});

export default (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  if (to.matched.some((record) => record.meta.public)) {
    next();
  } else if (to.matched.some((record) => record.meta.requiresAuth)) {
    /** Verify if user accessing route is an authenticated user **/
    routeGuard.verifyAuthRoutes(to, next);
  } else if (to.matched.some((record) => record.meta.guest)) {
    /** Verify if user accessing route is just a guest user **/
    routeGuard.verifyGuestRoutes(to, next);
  } else {
    // FALLBACK
    next();
  }
};
