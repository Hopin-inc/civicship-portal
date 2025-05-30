import type { AuthenticationState } from "./auth-state-store";
import { AuthStateStore } from "./auth-state-store";
import { GqlRole } from "@/types/graphql";
import { COMMUNITY_ID } from "@/utils";
import { matchPaths } from "@/utils/path";

/**
 * 認証状態に基づくリダイレクト処理を一元管理するサービス
 */
export class AuthRedirectService {
  private static instance: AuthRedirectService;
  private authStateStore: AuthStateStore;

  private constructor() {
    this.authStateStore = AuthStateStore.getInstance();
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
   * 電話番号認証が必要なパスかどうかを判定
   */
  public isPhoneVerificationRequiredPath(pathname: string): boolean {
    const phoneVerificationRequiredPaths = [
      "/sign-up",
    ];
    return matchPaths(pathname, ...phoneVerificationRequiredPaths);
  }

  /**
   * 管理者権限が必要なパスかどうかを判定
   */
  public isAdminPath(pathname: string): boolean {
    const adminRequiredPaths = [
      "/admin",
      "/admin/*",
    ];
    return matchPaths(pathname, ...adminRequiredPaths);
  }

  /**
   * 現在の認証状態とパスに基づいて適切なリダイレクト先を取得
   * @param pathname 現在のパス
   * @param next リダイレクト後に戻るパス（オプション）
   * @param isAuthenticating 認証処理中かどうか
   * @returns リダイレクト先のパス、またはnull（リダイレクト不要の場合）
   */
  public getRedirectPath(pathname: string, next?: string | null, isAuthenticating?: boolean): string | null {
    const authState = this.authStateStore.getState();
    const nextParam = next ? `?next=${ next }` : "";
    
    if (isAuthenticating) {
      console.log(`🔄 [${new Date().toISOString()}] Skipping redirect check - authentication in progress`);
      return null;
    }
    
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      const isReturnFromLineAuth = url.searchParams.has("code") && 
                                  url.searchParams.has("state") && 
                                  url.searchParams.has("liffClientId");
      
      if (isReturnFromLineAuth) {
        console.log(`🔄 [${new Date().toISOString()}] Detected LINE auth redirect in getRedirectPath - skipping redirect`);
        return null;
      }
    }

    if (this.isProtectedPath(pathname)) {
      switch (authState) {
        case "unauthenticated":
          return `/login${ nextParam }`;
        case "line_authenticated":
          return `/sign-up/phone-verification${ nextParam }`;
        case "phone_authenticated":
          return `/sign-up${ nextParam }`;
        default:
          break;
      }
    } else if (this.isPhoneVerificationRequiredPath(pathname)) {
      if (authState === "unauthenticated") {
        return `/login${ nextParam }`;
      } else if (authState === "line_authenticated" &&
        pathname !== "/sign-up/phone-verification") {
        return `/sign-up/phone-verification${ nextParam }`;
      }
    } else if (this.isAdminPath(pathname)) {
      if (authState !== "user_registered") {
        return `/login${ nextParam }`;
      }
    } else if (pathname === "/login" && authState === "user_registered") {
      return "/";
    }

    return null;
  }

  /**
   * LINE認証後のリダイレクト処理
   * @param liffState LIFFの状態パラメータ
   * @returns リダイレクト先のパス
   */
  public getPostLineAuthRedirectPath(nextPath: string | null): string {
    const next = nextPath ? decodeURIComponent(nextPath) : null;
    const authState = this.authStateStore.getState();

    switch (authState) {
      case "line_authenticated":
        return `/sign-up/phone-verification${ next ? `?next=${ next }` : "" }`;
      case "phone_authenticated":
        return `/sign-up${ next ? `?next=${ next }` : "" }`;
      case "user_registered":
        return next ?? "/";
      default:
        return `/login${ next ? `?next=${ next }` : "" }`;
    }
  }

  /**
   * 管理者権限チェック用のユーザー情報を取得
   */
  public async checkAdminAccess(currentUser: any): Promise<{ hasAccess: boolean; redirectPath: string | null }> {
    if (!currentUser) {
      return { hasAccess: false, redirectPath: "/login" };
    }

    if (!currentUser.memberships || currentUser.memberships.length === 0) {
      return { hasAccess: false, redirectPath: "/" };
    }

    const targetMembership = currentUser.memberships.find((m: any) => m.community?.id === COMMUNITY_ID);
    if (!targetMembership) {
      return { hasAccess: false, redirectPath: "/" };
    }

    const isCommunityManager = targetMembership &&
      (targetMembership.role === GqlRole.Owner || targetMembership.role === GqlRole.Manager);

    if (!isCommunityManager) {
      return { hasAccess: false, redirectPath: "/" };
    }

    return { hasAccess: true, redirectPath: null };
  }
}
