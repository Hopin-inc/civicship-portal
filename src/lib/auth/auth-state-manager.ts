import { TokenService } from "./token-service";
import { AuthStateStore } from "./auth-state-store";
import { AuthService } from "./auth-service";
import { apolloClient } from "@/lib/apollo";
import { GET_CURRENT_USER } from "@/graphql/account/identity/query";

export type AuthenticationState =
  | "unauthenticated"
  | "line_authenticated"
  | "phone_authenticated"
  | "user_registered"
  | "loading";

/**
 * 認証状態の管理を担当するクラス
 * 認証状態の遷移ロジックを集約し、他のコンポーネントから参照できるようにする
 * 
 * @deprecated このクラスは非推奨です。代わりに AuthStateStore と AuthService を使用してください。
 * 後方互換性のために維持されていますが、新しいコードでは使用しないでください。
 */
export class AuthStateManager {
  private static instance: AuthStateManager;
  private currentState: AuthenticationState = "loading";
  private stateChangeListeners: ((state: AuthenticationState) => void)[] = [];
  private authStateStore: AuthStateStore;
  private authService: AuthService;
  private tokenService: TokenService;

  private constructor() {
    if (typeof window !== "undefined") {
      window.addEventListener("auth:renew-line-token", this.handleLineTokenRenewal.bind(this));
      window.addEventListener("auth:renew-phone-token", this.handlePhoneTokenRenewal.bind(this));
    }
    
    this.authStateStore = AuthStateStore.getInstance();
    this.authService = AuthService.getInstance();
    this.tokenService = TokenService.getInstance();
    
    this.authStateStore.addStateChangeListener((state) => {
      this.currentState = state;
      this.notifyStateChange();
    });
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
    console.log("🔃 AuthStateManager.setState: ", this.currentState, "->", state);
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
   * @deprecated 代わりに AuthService.initializeAuthState() を使用してください。
   */
  public async initialize(): Promise<void> {
    console.warn("AuthStateManager.initialize is deprecated. Use AuthService.initializeAuthState instead.");
    this.setState("loading");
    
    await this.authService.initializeAuthState();
    
    return;
  }

  /**
   * ユーザー情報の登録状態を確認
   * useAuth()のuserプロパティと同じ logic を使用
   */
  private async checkUserRegistration(): Promise<boolean> {
    try {
      const { data } = await apolloClient.query({
        query: GET_CURRENT_USER,
        fetchPolicy: "network-only"
      });

      return data?.currentUser?.user != null;
    } catch (error) {
      console.error("Failed to check user registration:", error);
      return false;
    }
  }

  /**
   * LINEトークン更新イベントのハンドラー
   * @deprecated 代わりに AuthService を使用してください。
   */
  private async handleLineTokenRenewal(event: Event): Promise<void> {
    console.warn("AuthStateManager.handleLineTokenRenewal is deprecated. Use AuthService instead.");
    try {
      const lineTokens = this.tokenService.getLineTokens();
      const isValid = this.tokenService.isTokenValid(lineTokens);
      
      if (isValid) {
        await this.authService.handleLineAuthSuccess();
      } else {
        await this.authService.logout();
      }
    } catch (error) {
      console.error("Failed to renew LINE token:", error);
      await this.authService.logout();
    }
  }

  /**
   * 電話番号トークン更新イベントのハンドラー
   * @deprecated 代わりに AuthService を使用してください。
   */
  private async handlePhoneTokenRenewal(event: Event): Promise<void> {
    console.warn("AuthStateManager.handlePhoneTokenRenewal is deprecated. Use AuthService instead.");
    try {
      const phoneTokens = this.tokenService.getPhoneTokens();
      const lineTokens = this.tokenService.getLineTokens();
      const isPhoneValid = this.tokenService.isTokenValid(phoneTokens);
      const isLineValid = this.tokenService.isTokenValid(lineTokens);

      if (isPhoneValid) {
        await this.authService.handlePhoneAuthSuccess();
      } else if (!isPhoneValid) {
        if (!isLineValid) {
          await this.authService.logout();
        } else {
          await this.authService.handleLineAuthSuccess();
        }
      }
    } catch (error) {
      console.error("Failed to renew phone token:", error);

      const lineTokens = this.tokenService.getLineTokens();
      const isLineValid = this.tokenService.isTokenValid(lineTokens);

      if (!isLineValid) {
        await this.authService.logout();
      } else {
        await this.authService.handleLineAuthSuccess();
      }
    }
  }

  /**
   * LINE認証状態の変更を処理
   * @deprecated 代わりに AuthService.handleLineAuthStateChange() を使用してください。
   */
  public async handleLineAuthStateChange(isAuthenticated: boolean): Promise<void> {
    console.warn("AuthStateManager.handleLineAuthStateChange is deprecated. Use AuthService.handleLineAuthStateChange instead.");
    await this.authService.handleLineAuthStateChange(isAuthenticated);
  }

  /**
   * 電話番号認証状態の変更を処理
   * @deprecated 代わりに AuthService.handlePhoneAuthStateChange() を使用してください。
   */
  public async handlePhoneAuthStateChange(isVerified: boolean): Promise<void> {
    console.warn("AuthStateManager.handlePhoneAuthStateChange is deprecated. Use AuthService.handlePhoneAuthStateChange instead.");
    await this.authService.handlePhoneAuthStateChange(isVerified);
  }

  /**
   * ユーザー情報登録状態の変更を処理
   * @deprecated 代わりに AuthService.handleUserRegistrationSuccess() を使用してください。
   */
  public async handleUserRegistrationStateChange(isRegistered: boolean): Promise<void> {
    console.warn("AuthStateManager.handleUserRegistrationStateChange is deprecated. Use AuthService.handleUserRegistrationSuccess instead.");
    if (isRegistered) {
      await this.authService.handleUserRegistrationSuccess();
    }
  }
}
