import { useStorage } from "@packages/hooks";
import { RouteLocationNormalized, NavigationGuardNext } from "vue-router";
import { jwtDecode } from "jwt-decode";

const { getStorage } = useStorage();

interface IRouteGuard {
  tokenKey: string;
  loginRoute: string;
  logoutRoute: string;
  dashboardRoute: string;
}

class RouteGuard {
  private readonly REFRESH_KEY = "PORTAL_REFRESH_TOKEN";
  sessionTime: number = 15;
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

  private isRefreshExpired(): boolean {
    const token = getStorage({ storage_name: this.REFRESH_KEY }) as
      | string
      | null;
    if (!token) return true;
    try {
      const { exp } = jwtDecode<{ exp: number }>(token);
      return Date.now() >= exp * 1000;
    } catch {
      return true;
    }
  }

  verifyAuthRoutes(
    to: RouteLocationNormalized,
    next: NavigationGuardNext,
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
    next: NavigationGuardNext,
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
    is_guest: boolean = false,
  ): void {
    if (this.isRefreshExpired()) {
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
