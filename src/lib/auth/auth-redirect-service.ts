import type { AuthenticationState } from "./auth-state-manager";
import { AuthStateManager } from "./auth-state-manager";

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
    const publicPaths = [
      "/login",
      "/sign-up",
      "/sign-up/phone-verification",
      "/privacy-policy",
      "/terms-of-service",
    ];

    const adminPathPrefix = "/admin";

    return !publicPaths.includes(pathname) && !pathname.startsWith(adminPathPrefix);
  }

  /**
   * 電話番号認証が必要なパスかどうかを判定
   */
  public isPhoneVerificationRequiredPath(pathname: string): boolean {
    const phoneVerificationRequiredPaths = [
      "/sign-up",
    ];

    return phoneVerificationRequiredPaths.includes(pathname);
  }

  /**
   * 管理者権限が必要なパスかどうかを判定
   */
  public isAdminPath(pathname: string): boolean {
    return pathname.startsWith("/admin");
  }

  /**
   * 現在の認証状態とパスに基づいて適切なリダイレクト先を取得
   * @param pathname 現在のパス
   * @param next リダイレクト後に戻るパス（オプション）
   * @returns リダイレクト先のパス、またはnull（リダイレクト不要の場合）
   */
  public getRedirectPath(pathname: string, next?: string): string | null {
    const authState = this.authStateManager.getState();
    const nextParam = next ? `?next=${encodeURIComponent(next)}` : "";

    if (authState === "loading") {
      return null;
    }

    if (this.isProtectedPath(pathname)) {
      if (authState === "unauthenticated") {
        return `/login${nextParam}`;
      } else if (authState === "line_authenticated" || authState === "line_token_expired") {
        return `/sign-up/phone-verification${nextParam}`;
      } else if (authState === "phone_authenticated" || authState === "phone_token_expired") {
        return `/sign-up${nextParam}`;
      }
    }
    
    else if (this.isPhoneVerificationRequiredPath(pathname)) {
      if (authState === "unauthenticated") {
        return `/login${nextParam}`;
      } else if ((authState === "line_authenticated" || authState === "line_token_expired") && 
                 pathname !== "/sign-up/phone-verification") {
        return `/sign-up/phone-verification${nextParam}`;
      }
    }
    
    else if (this.isAdminPath(pathname)) {
      if (authState !== "user_registered") {
        return `/login${nextParam}`;
      }
    }
    
    else if (pathname === "/login" && authState === "user_registered") {
      return "/";
    }

    return null;
  }

  /**
   * LINE認証後のリダイレクト処理
   * @param liffState LIFFの状態パラメータ
   * @returns リダイレクト先のパス
   */
  public getPostLineAuthRedirectPath(liffState: string | null): string {
    if (!liffState) {
      return "/";
    }

    const nextMatch = liffState.match(/next=([^&]*)/);
    const next = nextMatch ? decodeURIComponent(nextMatch[1]) : null;

    const authState = this.authStateManager.getState();

    if (authState === "line_authenticated" || authState === "line_token_expired") {
      return `/sign-up/phone-verification${next ? `?next=${next}` : ""}`;
    } else if (authState === "phone_authenticated" || authState === "phone_token_expired") {
      return `/sign-up${next ? `?next=${next}` : ""}`;
    } else if (authState === "user_registered") {
      return next || "/";
    }

    return `/login${next ? `?next=${encodeURIComponent(next)}` : ""}`;
  }
}
