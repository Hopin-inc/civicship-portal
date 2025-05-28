import { LiffService } from "./liff-service";
import { PhoneAuthService } from "./phone-auth-service";
import { TokenManager } from "./token-manager";

export type AuthenticationState = 
  | "unauthenticated" 
  | "line_authenticated" 
  | "line_token_expired"
  | "phone_authenticated"
  | "phone_token_expired"
  | "user_registered"
  | "loading";

/**
 * 認証状態の管理を担当するクラス
 * 認証状態の遷移ロジックを集約し、他のコンポーネントから参照できるようにする
 */
export class AuthStateManager {
  private static instance: AuthStateManager;
  private currentState: AuthenticationState = "loading";
  private liffService: LiffService;
  private phoneAuthService: PhoneAuthService;
  private stateChangeListeners: ((state: AuthenticationState) => void)[] = [];

  private constructor() {
    this.liffService = LiffService.getInstance();
    this.phoneAuthService = PhoneAuthService.getInstance();
    
    if (typeof window !== "undefined") {
      window.addEventListener("auth:renew-line-token", this.handleLineTokenRenewal.bind(this));
      window.addEventListener("auth:renew-phone-token", this.handlePhoneTokenRenewal.bind(this));
    }
  }

  /**
   * シングルトンインスタンスを取得
   */
  public static getInstance(): AuthStateManager {
    if (!AuthStateManager.instance) {
      AuthStateManager.instance = new AuthStateManager();
    }
    return AuthStateManager.instance;
  }

  /**
   * 現在の認証状態を取得
   */
  public getState(): AuthenticationState {
    return this.currentState;
  }

  /**
   * 認証状態の変更を監視するリスナーを追加
   */
  public addStateChangeListener(listener: (state: AuthenticationState) => void): void {
    this.stateChangeListeners.push(listener);
  }

  /**
   * 認証状態の変更を監視するリスナーを削除
   */
  public removeStateChangeListener(listener: (state: AuthenticationState) => void): void {
    this.stateChangeListeners = this.stateChangeListeners.filter(l => l !== listener);
  }

  /**
   * 認証状態を更新
   */
  public setState(state: AuthenticationState): void {
    if (this.currentState !== state) {
      this.currentState = state;
      this.notifyStateChange();
    }
  }

  /**
   * 認証状態の変更を通知
   */
  private notifyStateChange(): void {
    this.stateChangeListeners.forEach(listener => {
      listener(this.currentState);
    });
  }

  /**
   * 認証状態を初期化
   */
  public async initialize(): Promise<void> {
    this.setState("loading");
    
    const lineTokens = TokenManager.getLineTokens();
    const hasValidLineToken = lineTokens.accessToken && !TokenManager.isLineTokenExpired();
    
    if (hasValidLineToken) {
      const phoneTokens = TokenManager.getPhoneTokens();
      const hasValidPhoneToken = phoneTokens.accessToken && !TokenManager.isPhoneTokenExpired();
      
      if (hasValidPhoneToken) {
        const isUserRegistered = await this.checkUserRegistration();
        
        if (isUserRegistered) {
          this.setState("user_registered");
        } else {
          this.setState("phone_authenticated");
        }
      } else {
        this.setState("line_authenticated");
      }
    } else {
      this.setState("unauthenticated");
    }
  }

  /**
   * ユーザー情報の登録状態を確認
   */
  private async checkUserRegistration(): Promise<boolean> {
    try {
      const lineTokens = TokenManager.getLineTokens();
      const phoneTokens = TokenManager.getPhoneTokens();
      
      return !!(lineTokens.accessToken && phoneTokens.accessToken && phoneTokens.phoneUid);
    } catch (error) {
      console.error("Failed to check user registration:", error);
      return false;
    }
  }

  /**
   * LINEトークン更新イベントのハンドラー
   */
  private async handleLineTokenRenewal(event: Event): Promise<void> {
    try {
      const renewed = await TokenManager.renewLineToken();
      
      if (renewed && this.currentState === "line_token_expired") {
        this.setState("line_authenticated");
      } else if (!renewed) {
        this.setState("unauthenticated");
      }
    } catch (error) {
      console.error("Failed to renew LINE token:", error);
      this.setState("unauthenticated");
    }
  }

  /**
   * 電話番号トークン更新イベントのハンドラー
   */
  private async handlePhoneTokenRenewal(event: Event): Promise<void> {
    try {
      const renewed = await TokenManager.renewPhoneToken();
      
      if (renewed && this.currentState === "phone_token_expired") {
        this.setState("phone_authenticated");
      } else if (!renewed) {
        this.setState("line_authenticated");
      }
    } catch (error) {
      console.error("Failed to renew phone token:", error);
      this.setState("line_authenticated");
    }
  }

  /**
   * LINE認証状態の変更を処理
   */
  public handleLineAuthStateChange(isAuthenticated: boolean): void {
    if (isAuthenticated) {
      if (this.currentState === "unauthenticated" || this.currentState === "loading") {
        this.setState("line_authenticated");
      }
    } else {
      this.setState("unauthenticated");
    }
  }

  /**
   * 電話番号認証状態の変更を処理
   */
  public handlePhoneAuthStateChange(isVerified: boolean): void {
    if (isVerified) {
      if (this.currentState === "line_authenticated" || this.currentState === "line_token_expired") {
        this.setState("phone_authenticated");
      }
    } else {
      if (this.currentState !== "unauthenticated" && this.currentState !== "loading") {
        this.setState("line_authenticated");
      }
    }
  }

  /**
   * ユーザー情報登録状態の変更を処理
   */
  public handleUserRegistrationStateChange(isRegistered: boolean): void {
    if (isRegistered) {
      if (this.currentState === "phone_authenticated" || this.currentState === "phone_token_expired") {
        this.setState("user_registered");
      }
    } else {
      if (this.currentState === "user_registered") {
        this.setState("phone_authenticated");
      }
    }
  }
}
