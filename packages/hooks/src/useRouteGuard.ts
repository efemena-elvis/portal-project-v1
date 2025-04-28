import { useStorage, useString } from "@packages/hooks";
import { RouteLocationNormalized, NavigationGuardNext } from "vue-router";

const { getStorage } = useStorage();
const { checkAuthTimeout } = useString();

interface IRouteGuard {
  tokenKey: string;
  loginRoute: string;
  logoutRoute: string;
  dashboardRoute: string;
}

class RouteGuard {
  sessionTime: number = 90;
  tokenKey: string = "";
  loginRoute: string = "";
  logoutRoute: string = "";
  dashboardRoute: string = "";

  constructor(config: IRouteGuard) {
    this.tokenKey = config.tokenKey;
    this.loginRoute = config.loginRoute;
    this.logoutRoute = config.logoutRoute;
    this.dashboardRoute = config.dashboardRoute;
  }

  private getAuthToken(): string | object | null {
    return getStorage({
      storage_name: this.tokenKey,
    });
  }

  verifyAuthRoutes(
    to: RouteLocationNormalized,
    next: NavigationGuardNext
  ): void {
    if (this.getAuthToken() === null) {
      next({
        name: this.loginRoute,
      });
    } else {
      this.checkUserTimeoutSession(to, next);
    }
  }

  verifyGuestRoutes(
    to: RouteLocationNormalized,
    next: NavigationGuardNext
  ): void {
    if (this.getAuthToken() === null) {
      next();
    } else {
      this.checkUserTimeoutSession(to, next, true);
    }
  }

  checkUserTimeoutSession(
    to: RouteLocationNormalized,
    next: NavigationGuardNext,
    is_guest: boolean = false
  ): void {
    const is_timed_out: boolean = checkAuthTimeout(this.sessionTime);

    if (is_timed_out) {
      if (to?.name !== this.logoutRoute) {
        next({ name: this.logoutRoute });
      } else {
        next();
      }
    } else {
      is_guest ? next({ name: this.dashboardRoute }) : next();
    }
  }
}

export default RouteGuard;
