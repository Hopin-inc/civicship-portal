import { AuthStateManager } from "../core/auth-state-manager";
import { GqlRole, GqlUser } from "@/types/graphql";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import {
  encodeURIComponentWithType,
  extractSearchParamFromRelativePath,
  matchPaths,
  RawURIComponent,
} from "@/utils/path";

/**
 * Owner専用のパス一覧
 */
const OWNER_ONLY_PATHS = ["/admin/wallet", "/admin/members"];

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
    const phoneVerificationRequiredPaths = ["/sign-up", "/sign-up/phone-verification"];
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
  public getRedirectPath(
    pathname: RawURIComponent,
    next?: RawURIComponent | null,
  ): RawURIComponent | null {
    const authState = this.authStateManager.getState();
    const nextParam = next ? this.generateNextParam(next) : this.generateNextParam(pathname);

    // ✅ クエリを除去した basePath を使用
    const basePath = pathname.split("?")[0];

    // --- 🪵 デバッグログ追加 ---
    const entry = {
      ts: new Date().toISOString(),
      step: "🎯 getRedirectPath",
      pathname,
      basePath, // 👈 新規追加
      next,
      authState,
    };
    console.log("[AUTH REDIRECT PATH]", entry);

    if (typeof window !== "undefined") {
      try {
        const existing = JSON.parse(localStorage.getItem("get-redirect-path-debug") || "[]");
        existing.push(entry);
        localStorage.setItem("get-redirect-path-debug", JSON.stringify(existing.slice(-200)));
      } catch {}
    }

    // --- ローディング時は安全にスキップ ---
    if (authState === "loading" || authState === "authenticating") {
      return null;
    }

    // --- user_registered がログイン・サインアップ画面に来たら redirect ---
    if (
      ["/login", "/sign-up/phone-verification", "/sign-up"].includes(basePath) &&
      authState === "user_registered"
    ) {
      if (next?.startsWith("/") && !next.startsWith("/login") && !next.startsWith("/sign-up")) {
        return next;
      } else if (next) {
        const nextRoute = extractSearchParamFromRelativePath(next, "next");
        return (nextRoute ?? "/") as RawURIComponent;
      } else {
        return "/" as RawURIComponent;
      }
    }

    // --- 認証保護ルートの処理 ---
    if (this.isProtectedPath(basePath)) {
      switch (authState) {
        case "unauthenticated":
          return `/login${nextParam}` as RawURIComponent;
        case "line_token_expired":
          return `/sign-up/phone-verification${nextParam}` as RawURIComponent;
        case "phone_token_expired":
          return `/sign-up${nextParam}` as RawURIComponent;
        default:
          return null;
      }
    }

    // --- サインアップフロー内の処理 ---
    if (this.isPathInSignUpFlow(basePath)) {
      switch (authState) {
        case "unauthenticated":
          return `/login${nextParam}` as RawURIComponent;

        case "line_authenticated":
        case "line_token_expired":
          if (basePath !== "/sign-up/phone-verification") {
            return `/sign-up/phone-verification${nextParam}` as RawURIComponent;
          }
          return null;

        case "phone_authenticated":
          if (basePath !== "/sign-up") {
            return `/sign-up${nextParam}` as RawURIComponent;
          }
          return null;

        case "user_registered":
        default:
          if (next && next.startsWith("/") && !next.startsWith("/sign-up")) {
            return next;
          }
          return "/" as RawURIComponent;
      }
    }

    // --- 管理画面パスの保護 ---
    if (this.isAdminPath(basePath)) {
      if (authState !== "user_registered") {
        return `/login${nextParam}` as RawURIComponent;
      }
    }

    return null;
  }

  private generateNextParam(nextPath: RawURIComponent): RawURIComponent {
    return `?next=${encodeURIComponentWithType(nextPath)}` as RawURIComponent;
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
    if (pathname && OWNER_ONLY_PATHS.some((ownerPath) => matchPaths(pathname, ownerPath))) {
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
