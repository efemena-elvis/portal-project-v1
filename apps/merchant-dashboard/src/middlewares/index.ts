// =============================================
// APPLICATION AUTHENTICATION MIDDLEWARE
// =============================================
import { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import { useRouteGuard } from "@packages/hooks";
import constants from "@/shared/utilities/constants";

const { APP_AUTH_TOKEN } = constants;

/* CONFIGURATION */
const routeGuard = new useRouteGuard({
  tokenKey: APP_AUTH_TOKEN,
  loginRoute: "VesicashLogin",
  logoutRoute: "VesicashLogout",
  dashboardRoute: "VesicashOverview",
});

export default (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  /** Verify if user accessing route is an authenticated user **/
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    routeGuard.verifyAuthRoutes(to, next);
  } else if (to.matched.some((record) => record.meta.guest)) {
    console.log("HAHA WE HERE THEN", to.matched);
    /** Verify if user accessing route is just a guest user **/
    routeGuard.verifyGuestRoutes(to, next);
  } else {
    // FALLBACK
    next();
  }
};
