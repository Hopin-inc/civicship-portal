import { AuthStateManager } from "../core/auth-state-manager";
import { GqlUser } from "@/types/graphql";
import { encodeURIComponentWithType, matchPaths, RawURIComponent } from "@/utils/path";
import { AccessPolicy } from "@/lib/auth/core/access-policy";
import { AuthenticationState } from "@/types/auth";

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

    if (authState === "loading" || authState === "authenticating") return null;

    // 1️⃣ ログイン済みユーザーがlogin/sign-up画面に来た場合
    const redirectFromLogin = this.handleAuthEntryFlow(
      pathname,
      basePath,
      authState,
      next,
      nextParam,
    );
    if (redirectFromLogin) return redirectFromLogin;

    // 2️⃣ 未認証ユーザーがユーザー専用パスに来た場合
    const redirectFromUserPath = this.handleUserPath(basePath, authState, currentUser, nextParam);
    if (redirectFromUserPath) return redirectFromUserPath;

    // 4️⃣ ロール不足
    const redirectByRole = this.handleRoleRestriction(currentUser, basePath);
    if (redirectByRole) return redirectByRole;

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
    if (!currentUser) return null;
    if (!AccessPolicy.canAccessRole(currentUser, basePath)) {
      return AccessPolicy.getFallbackPath(currentUser) as RawURIComponent;
    }
    return null;
  }
}
