"use client";

import { AuthStateStore } from "./auth-state-store";
import { TokenService } from "./token-service";

/**
 * 認証サービス - 認証処理のみを担当（状態を持たない）
 */
export class AuthService {
  private static instance: AuthService;
  private authStateStore: AuthStateStore;
  private tokenService: TokenService;

  private constructor() {
    this.authStateStore = AuthStateStore.getInstance();
    this.tokenService = TokenService.getInstance();
  }

  /**
   * シングルトンインスタンスを取得
   */
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * 初期認証状態を確認
   */
  public async initializeAuthState(): Promise<void> {
    console.log("🔍 Initializing authentication state...");
    
    const currentState = this.authStateStore.getState();
    if (currentState === "user_registered") {
      console.log("✅ User already registered, maintaining state");
      return;
    }

    const lineTokens = this.tokenService.getLineTokens();
    const phoneTokens = this.tokenService.getPhoneTokens();

    if (this.tokenService.isTokenValid(lineTokens)) {
      console.log("📱 Valid LINE tokens found");
      
      if (this.tokenService.isTokenValid(phoneTokens) && phoneTokens.phoneUid) {
        console.log("📞 Valid phone tokens found");
        this.authStateStore.setState("phone_authenticated");
      } else {
        console.log("❌ Phone tokens invalid or expired");
        this.authStateStore.setState("line_authenticated");
      }
    } else {
      console.log("❌ No valid authentication tokens found");
      this.authStateStore.setState("unauthenticated");
    }
  }

  /**
   * LINE認証後の状態更新
   */
  public async handleLineAuthSuccess(): Promise<void> {
    console.log("✅ LINE authentication successful");
    this.authStateStore.setState("line_authenticated");
  }
  
  /**
   * LINE認証状態の変更を処理
   */
  public async handleLineAuthStateChange(isAuthenticated: boolean): Promise<void> {
    console.log(`📱 LINE authentication state changed: ${isAuthenticated ? "authenticated" : "unauthenticated"}`);
    if (isAuthenticated) {
      this.authStateStore.setState("line_authenticated");
    } else {
      this.authStateStore.setState("unauthenticated");
    }
  }

  /**
   * 電話番号認証後の状態更新
   */
  public async handlePhoneAuthSuccess(): Promise<void> {
    console.log("✅ Phone authentication successful");
    this.authStateStore.setState("phone_authenticated");
  }
  
  /**
   * 電話番号認証状態の変更を処理
   */
  public async handlePhoneAuthStateChange(isAuthenticated: boolean): Promise<void> {
    console.log(`📱 Phone authentication state changed: ${isAuthenticated ? "authenticated" : "unauthenticated"}`);
    if (isAuthenticated) {
      this.authStateStore.setState("phone_authenticated");
    } else {
      const lineTokens = this.tokenService.getLineTokens();
      if (this.tokenService.isTokenValid(lineTokens)) {
        this.authStateStore.setState("line_authenticated");
      } else {
        this.authStateStore.setState("unauthenticated");
      }
    }
  }

  /**
   * ユーザー登録後の状態更新
   */
  public async handleUserRegistrationSuccess(): Promise<void> {
    console.log("✅ User registration successful");
    this.authStateStore.setState("user_registered");
  }

  /**
   * トークン期限切れ処理
   * LINEトークン期限切れ: /loginへリダイレクト
   * 電話番号トークン期限切れ: ユーザー登録済みなら更新不要、未登録なら/sign-up/phone-verificationへリダイレクト
   */
  public async handleTokenExpired(tokenType: "line" | "phone"): Promise<void> {
    if (tokenType === "line") {
      console.log("🔄 LINE token expired, redirecting to login");
      this.tokenService.clearLineTokens();
      this.authStateStore.forceSetState("unauthenticated");
      
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    } else {
      console.log("🔄 Phone token expired, checking user registration status");
      this.tokenService.clearPhoneTokens();
      
      const currentState = this.authStateStore.getState();
      if (currentState === "user_registered") {
        console.log("📱 User already registered, attempting token refresh");
        const lineTokens = this.tokenService.getLineTokens();
        if (this.tokenService.isTokenValid(lineTokens)) {
          console.log("✅ LINE tokens still valid, maintaining user_registered state");
          return;
        } else {
          console.log("❌ Both LINE and phone tokens expired, forcing logout");
          this.authStateStore.forceSetState("unauthenticated");
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        }
      } else {
        console.log("📱 User not registered, redirecting to phone verification");
        const lineTokens = this.tokenService.getLineTokens();
        if (this.tokenService.isTokenValid(lineTokens)) {
          this.authStateStore.forceSetState("line_authenticated");
        } else {
          this.authStateStore.forceSetState("unauthenticated");
        }
        
        if (typeof window !== "undefined") {
          window.location.href = "/sign-up/phone-verification";
        }
      }
    }
  }

  /**
   * ログアウト処理
   */
  public async logout(): Promise<void> {
    console.log("🚪 Logging out user");
    this.tokenService.clearAllTokens();
    this.authStateStore.setState("unauthenticated");
  }
}
