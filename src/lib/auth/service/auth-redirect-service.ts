import { AuthStateManager } from "../core/auth-state-manager";
import { GqlUser } from "@/types/graphql";
import { encodeURIComponentWithType, matchPaths, RawURIComponent } from "@/utils/path";
import { AccessPolicy } from "@/lib/auth/core/access-policy";
import { AuthenticationState } from "@/types/auth";
import { logger } from "@/lib/logging";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { isRunningInLiff } from "../core/environment-detector";

export class AuthRedirectService {
  private static instance: AuthRedirectService;
  private authStateManager: AuthStateManager;

  private constructor() {
    this.authStateManager = AuthStateManager.getInstance();
  }

  public static getInstance(): AuthRedirectService {
    if (!AuthRedirectService.instance) {
      AuthRedirectService.instance = new AuthRedirectService();
    }
    return AuthRedirectService.instance;
  }

  public getRedirectPath(
    pathname: RawURIComponent,
    next?: RawURIComponent | null,
    currentUser?: GqlUser | null,
  ): RawURIComponent | null {
    const authState = this.authStateManager.getState();
    const basePath = pathname.split("?")[0];
    const nextParam = next ? this.generateNextParam(next) : this.generateNextParam(pathname);

    logger.info("[LIFF-DEBUG] AuthRedirectService.getRedirectPath", {
      pathname,
      basePath,
      authState,
      currentUser: !!currentUser,
      currentUserId: currentUser?.id,
      next,
    });

    if (authState === "loading" || authState === "authenticating") {
      logger.info("[LIFF-DEBUG] AuthRedirectService: skipping (loading/authenticating)");
      return null;
    }

    const redirectFromLogin = this.handleAuthEntryFlow(
      pathname,
      basePath,
      authState,
      next,
      nextParam,
    );
    if (redirectFromLogin) {
      logger.info("[LIFF-DEBUG] AuthRedirectService: redirect from handleAuthEntryFlow", {
        redirectPath: redirectFromLogin,
      });
      return redirectFromLogin;
    }

    const redirectFromUserPath = this.handleUserPath(basePath, authState, currentUser, nextParam);
    if (redirectFromUserPath) {
      logger.info("[LIFF-DEBUG] AuthRedirectService: redirect from handleUserPath", {
        redirectPath: redirectFromUserPath,
      });
      return redirectFromUserPath;
    }

    const redirectByRole = this.handleRoleRestriction(currentUser, basePath);
    if (redirectByRole) {
      logger.info("[LIFF-DEBUG] AuthRedirectService: redirect from handleRoleRestriction", {
        redirectPath: redirectByRole,
      });
      return redirectByRole;
    }

    logger.info("[LIFF-DEBUG] AuthRedirectService: no redirect needed");
    return null;
  }

  private generateNextParam(nextPath: RawURIComponent): RawURIComponent {
    return `?next=${encodeURIComponentWithType(nextPath)}` as RawURIComponent;
  }

  private isAuthEntryPath(pathname: string): boolean {
    const authEntryPaths = ["/login", "/sign-up", "/sign-up/phone-verification"];
    return matchPaths(pathname, ...authEntryPaths);
  }

  private handleAuthEntryFlow(
    pathname: string,
    basePath: string,
    authState: AuthenticationState,
    next?: string | null,
    nextParam?: string,
  ): RawURIComponent | null {
    if (!this.isAuthEntryPath(basePath)) return null;

    switch (authState) {
      case "unauthenticated":
        if (basePath !== "/login") {
          return `/login${nextParam}` as RawURIComponent; // 未ログイン → ログインへ
        }
        return null;

      case "line_authenticated": {
        const target = `/sign-up/phone-verification${nextParam}`;
        if (pathname === target || basePath === "/sign-up/phone-verification") return null; // すでに居る場合はリダイレクト不要
        return target as RawURIComponent; // LINE認証済み → 電話認証へ
      }

      case "phone_authenticated":
        if (basePath !== "/sign-up") {
          return `/sign-up${nextParam}` as RawURIComponent; // 電話認証済み → サインアップへ
        }
        return null;

      case "user_registered":
        // 特別扱い: メンバーシップ作成フローのために特定のページを許可
        if (basePath === "/sign-up/phone-verification" || (basePath === "/login" && next)) {
          // next がある場合のみ（メンバーシップ作成フロー）
          return null; // このページに留まらせる（リダイレクトしない）
        }

        // 登録済みユーザーが sign-up 系や login に来たらトップ or nextへ
        if (next?.startsWith("/") && !next.startsWith("/login") && !next.startsWith("/sign-up")) {
          return next as RawURIComponent;
        }
        return "/" as RawURIComponent;

      default:
        return null;
    }
  }

  private isUserPath(pathname: string): boolean {
    const userPaths = ["/users/me", "/tickets", "/wallets", "/wallets/*", "/admin", "/admin/*"];
    return matchPaths(pathname, ...userPaths);
  }

  private handleUserPath(
    basePath: string,
    authState: AuthenticationState,
    currentUser: GqlUser | null | undefined,
    nextParam?: string,
  ): RawURIComponent | null {
    if (!this.isUserPath(basePath)) return null;

    switch (authState) {
      case "unauthenticated":
        return `/login${nextParam}` as RawURIComponent; // 未ログイン → ログインへ

      case "line_authenticated":
        if (!currentUser) {
          return `/sign-up/phone-verification${nextParam}` as RawURIComponent; // LINE認証済み・未登録 → 電話認証へ
        }
        break;

      case "phone_authenticated":
        if (!currentUser) {
          return `/sign-up${nextParam}` as RawURIComponent; // 電話認証済み・未登録 → サインアップへ
        }
        break;
    }
    return null;
  }

  private handleRoleRestriction(
    currentUser: GqlUser | null | undefined,
    basePath: string,
  ): RawURIComponent | null {
    logger.info("[LIFF-DEBUG] handleRoleRestriction: start", {
      basePath,
      userId: currentUser?.id,
      hasMemberships: !!currentUser?.memberships?.length,
      membershipsCount: currentUser?.memberships?.length ?? 0,
      membershipIds: currentUser?.memberships?.map(m => m.community?.id) ?? [],
      component: "AuthRedirectService",
    });

    if (!currentUser) {
      logger.info("[LIFF-DEBUG] handleRoleRestriction: no currentUser", {
        component: "AuthRedirectService",
      });
      return null;
    }

    const canAccess = AccessPolicy.canAccessRole(currentUser, basePath);
    logger.info("[LIFF-DEBUG] handleRoleRestriction: canAccessRole result", {
      basePath,
      userId: currentUser.id,
      canAccess,
      component: "AuthRedirectService",
    });

    if (!canAccess) {
      // Check if user has membership in current community
      const membership = currentUser.memberships?.find(
        (m) => m.community?.id === COMMUNITY_ID
      );

      if (!membership) {
        // User is authenticated but not a member of this community
        // Environment detection: LIFF → phone-verification, non-LIFF → login
        const isLiff = isRunningInLiff();
        const targetPath = isLiff
          ? `/sign-up/phone-verification?next=${encodeURIComponent(basePath)}`
          : `/login?next=${encodeURIComponent(basePath)}`;
        
        logger.info("[LIFF-DEBUG] handleRoleRestriction: non-member redirect", {
          basePath,
          userId: currentUser.id,
          currentCommunityId: COMMUNITY_ID,
          targetPath,
          environment: isLiff ? "liff" : "non-liff",
          reason: "no membership in current community",
          component: "AuthRedirectService",
        });
        return targetPath as RawURIComponent;
      }

      // User has membership but insufficient role (e.g., trying to access /admin)
      const fallbackPath = AccessPolicy.getFallbackPath(currentUser);
      logger.info("[LIFF-DEBUG] handleRoleRestriction: redirecting to fallback", {
        basePath,
        userId: currentUser.id,
        fallbackPath,
        reason: "has membership but insufficient role",
        component: "AuthRedirectService",
      });
      return fallbackPath as RawURIComponent;
    }

    logger.info("[LIFF-DEBUG] handleRoleRestriction: access allowed", {
      basePath,
      userId: currentUser.id,
      component: "AuthRedirectService",
    });
    return null;
  }
}
