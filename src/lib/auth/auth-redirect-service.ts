import { AuthStateManager } from "./auth-state-manager";
import { GqlRole, GqlUser } from "@/types/graphql";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import {
  encodeURIComponentWithType,
  extractSearchParamFromRelativePath,
  matchPaths,
  RawURIComponent,
} from "@/utils/path";
import { logger } from "@/lib/logging";

/**
 * Owner専用のパス一覧
 */
const OWNER_ONLY_PATHS = [
  '/admin/wallet',
  '/admin/members'
];

/**
 * 認証状態に基づくリダイレクト処理を一元管理するサービス
 */
export class AuthRedirectService {
  private static instance: AuthRedirectService;
  private authStateManager: AuthStateManager;

  private constructor() {
    this.authStateManager = AuthStateManager.getInstance();
  }

  /**
   * シングルトンインスタンスを取得
   */
  public static getInstance(): AuthRedirectService {
    if (!AuthRedirectService.instance) {
      AuthRedirectService.instance = new AuthRedirectService();
    }
    return AuthRedirectService.instance;
  }

  /**
   * 保護されたパスかどうかを判定
   */
  public isProtectedPath(pathname: string): boolean {
    const protectedPaths = [
      "/users/me",
      "/tickets",
      "/wallets",
      "/wallets/*",
      "/admin",
      "/admin/*",
    ];
    return matchPaths(pathname, ...protectedPaths);
  }

  /**
   * ユーザー登録プロセスのパスかどうかを判定
   */
  public isPathInSignUpFlow(pathname: string): boolean {
    const phoneVerificationRequiredPaths = [
      "/sign-up",
      "/sign-up/phone-verification",
    ];
    return matchPaths(pathname, ...phoneVerificationRequiredPaths);
  }

  /**
   * 管理者権限が必要なパスかどうかを判定
   */
  public isAdminPath(pathname: string): boolean {
    const adminRequiredPaths = ["/admin", "/admin/*"];
    return matchPaths(pathname, ...adminRequiredPaths);
  }

  /**
   * 現在の認証状態とパスに基づいて適切なリダイレクト先を取得
   * @param pathname 現在のパス
   * @param next リダイレクト後に戻るパス（オプション）
   * @returns リダイレクト先のパス、またはnull（リダイレクト不要の場合）
   */
  public getRedirectPath(pathname: RawURIComponent, next?: RawURIComponent | null): RawURIComponent | null {
    // LIFF環境では自動ログイン処理が実行されるため、unauthenticated状態でもリダイレクトしない
    const isLiffEnvironment = typeof window !== "undefined" && 
      (window.location.href.includes("liff.line.me") || 
       window.location.href.includes("liffClientId"));
    const authState = this.authStateManager.getState();
    const nextParam = next
      ? this.generateNextParam(next)
      : this.generateNextParam(pathname);

    if (authState === "loading") {
      return null;
    }

    if (
      ["/login", "/sign-up/phone-verification", "/sign-up"].includes(pathname)
      && authState === "user_registered"
    ) {
      if (
        next?.startsWith("/")
        && !next.startsWith("/login")
        && !next.startsWith("/sign-up")
      ) {
        return next;
      } else if (next) {
        const nextRoute = extractSearchParamFromRelativePath(next, "next");
        return (nextRoute ?? "/") as RawURIComponent;
      } else {
        return "/" as RawURIComponent;
      }
    }

    if (this.isProtectedPath(pathname)) {
      switch (authState) {
        case "unauthenticated":
          // LIFF環境では自動ログイン処理が実行されるため、リダイレクトしない
          if (isLiffEnvironment) {
            return null;
          }
          return `/login${ nextParam }` as RawURIComponent;
        case "line_authenticated":
        case "line_token_expired":
          return `/sign-up/phone-verification${ nextParam }` as RawURIComponent;
        case "phone_authenticated":
        case "phone_token_expired":
          return `/sign-up${ nextParam }` as RawURIComponent;
        default:
          return null;
      }
    }

    if (this.isPathInSignUpFlow(pathname)) {
      switch (authState) {
        case "unauthenticated":
          return `/login${ nextParam }` as RawURIComponent;

        case "line_authenticated":
        case "line_token_expired":
          if (pathname !== "/sign-up/phone-verification") {
            return `/sign-up/phone-verification${ nextParam }` as RawURIComponent;
          }
          return null; // stay here

        case "phone_authenticated":
          if (pathname !== "/sign-up") {
            return `/sign-up${ nextParam }` as RawURIComponent;
          }
          return null; // stay here

        case "user_registered":
        default:
          if (next && next.startsWith("/") && !next.startsWith("/sign-up")) {
            return next;
          }
          return "/" as RawURIComponent;
      }
    }

    if (this.isAdminPath(pathname)) {
      if (authState !== "user_registered") {
        return `/login${ nextParam }` as RawURIComponent;
      }
    }

    return null;
  }

  private generateNextParam(nextPath: RawURIComponent): RawURIComponent {
    return `?next=${ encodeURIComponentWithType(nextPath) }` as RawURIComponent;
  }

  /**
   * LINE認証後のリダイレクト処理
   * @returns リダイレクト先のパス
   * @param nextPath
   */
  public getPostLineAuthRedirectPath(nextPath: RawURIComponent | null): RawURIComponent {
    const nextParam = nextPath ? this.generateNextParam(nextPath) : "";

    const authState = this.authStateManager.getState();

    // LIFF環境では自動ログイン処理が実行されるため、unauthenticated状態でもリダイレクトしない
    const isLiffEnvironment = typeof window !== "undefined" && 
      (window.location.href.includes("liff.line.me") || 
       window.location.href.includes("liffClientId"));

    switch (authState) {
      case "unauthenticated":
      case "line_token_expired":
        // LIFF環境では自動ログイン処理が実行されるため、リダイレクトしない
        if (isLiffEnvironment) {
          return nextPath ?? "/" as RawURIComponent;
        }
        return `/login${ nextParam }` as RawURIComponent;

      case "line_authenticated":
      case "phone_token_expired":
        return `/sign-up/phone-verification${ nextParam }` as RawURIComponent;

      case "phone_authenticated":
        return `/sign-up${ nextParam }` as RawURIComponent;

      case "loading":
      case "user_registered":
      default:
        return nextPath ?? "/" as RawURIComponent;
    }
  }

  /**
   * 管理者権限チェック用のユーザー情報を取得
   */
  public async checkAdminAccess(
    currentUser: GqlUser | null | undefined,
    pathname?: string,
  ): Promise<{ hasAccess: boolean; redirectPath: string | null }> {
    if (!currentUser) {
      return { hasAccess: false, redirectPath: "/login" };
    }

    if (!currentUser.memberships || currentUser.memberships.length === 0) {
      return { hasAccess: false, redirectPath: "/" };
    }

    const targetMembership = currentUser.memberships.find(
      (m: any) => m.community?.id === COMMUNITY_ID,
    );
    if (!targetMembership) {
      return { hasAccess: false, redirectPath: "/" };
    }

    // Owner専用のパスチェック
    if (pathname && OWNER_ONLY_PATHS.some(ownerPath => matchPaths(pathname, ownerPath))) {
      if (targetMembership.role !== GqlRole.Owner) {
        return { hasAccess: false, redirectPath: "/" };
      }
    }
    const isCommunityManager =
      targetMembership &&
      (targetMembership.role === GqlRole.Owner || targetMembership.role === GqlRole.Manager);

    if (!isCommunityManager) {
      return { hasAccess: false, redirectPath: "/" };
    }

    return { hasAccess: true, redirectPath: null };
  }
}
