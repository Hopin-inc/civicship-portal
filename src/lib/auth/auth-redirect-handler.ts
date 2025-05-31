import { AuthStateManager, AuthenticationState } from "./auth-state-manager";
import { extractSearchParamFromRelativePath } from "@/utils/path";

/**
 * 認証状態変更時のリダイレクト処理を担当するクラス
 */
export class AuthRedirectHandler {
  private static instance: AuthRedirectHandler;
  private authStateManager: AuthStateManager;
  private isListenerRegistered = false;

  private constructor() {
    this.authStateManager = AuthStateManager.getInstance();
  }

  /**
   * シングルトンインスタンスを取得
   */
  public static getInstance(): AuthRedirectHandler {
    if (!AuthRedirectHandler.instance) {
      AuthRedirectHandler.instance = new AuthRedirectHandler();
    }
    return AuthRedirectHandler.instance;
  }

  /**
   * リダイレクトリスナーを初期化
   */
  public initialize(): void {
    if (this.isListenerRegistered || typeof window === "undefined") {
      return;
    }

    this.authStateManager.addStateChangeListener(this.handleStateChange.bind(this));
    this.isListenerRegistered = true;
    console.log("🔄 AuthRedirectHandler initialized");
  }

  /**
   * 認証状態変更時のハンドラー
   */
  private handleStateChange(newState: AuthenticationState): void {
    if (newState === "user_registered") {
      this.handleUserRegisteredRedirect();
    }
  }

  /**
   * user_registered状態になったときのリダイレクト処理
   */
  private handleUserRegisteredRedirect(): void {
    if (typeof window === "undefined") {
      return;
    }

    const nextParam = extractSearchParamFromRelativePath(window.location.href, "next");
    
    if (nextParam && nextParam.startsWith("/") && !nextParam.startsWith("/login") && !nextParam.startsWith("/sign-up")) {
      console.log("🚀 Redirecting to next parameter:", nextParam);
      window.location.href = nextParam;
    } else {
      console.log("🔍 No valid next parameter found, staying on current page");
    }
  }

  /**
   * クリーンアップ（必要に応じて）
   */
  public cleanup(): void {
    if (this.isListenerRegistered) {
      this.authStateManager.removeStateChangeListener(this.handleStateChange.bind(this));
      this.isListenerRegistered = false;
    }
  }
}
