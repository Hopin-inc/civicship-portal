import { TokenManager } from "./token-manager";
import { apolloClient } from "@/lib/apollo";
import { GET_CURRENT_USER } from "@/graphql/account/identity/query";
import { logger } from "@/lib/logging";
import { 
  AuthState, 
  AuthenticationState, 
  LoadingState, 
  TokenStatus, 
  AuthError, 
  AuthStateChangeListener,
  LegacyAuthenticationState 
} from "@/types/auth";

/**
 * 認証状態の管理を担当するクラス
 * 認証状態の遷移ロジックを集約し、他のコンポーネントから参照できるようにする
 */
export class AuthStateManager {
  private static instance: AuthStateManager;
  private state: AuthState = {
    authentication: "unauthenticated",
    tokenStatus: { lineTokenExpired: false, phoneTokenExpired: false },
    loading: { isLoading: false, phase: "idle" },
    firebaseUser: null,
    currentUser: null,
    environment: null,
    error: null
  };
  private stateChangeListeners: AuthStateChangeListener[] = [];
  private readonly sessionId: string;

  private constructor() {
    this.sessionId = this.initializeSessionId();
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
  public getState(): AuthState {
    return { ...this.state };
  }

  public getLegacyState(): LegacyAuthenticationState {
    const { authentication, tokenStatus, loading } = this.state;
    
    if (loading.isLoading) {
      return "loading";
    }
    
    if (tokenStatus.lineTokenExpired && authentication === "line_authenticated") {
      return "line_token_expired";
    }
    
    if (tokenStatus.phoneTokenExpired && authentication === "phone_authenticated") {
      return "phone_token_expired";
    }
    
    return authentication as LegacyAuthenticationState;
  }

  /**
   * 現在のセッションIDを取得
   */
  public getSessionId(): string {
    return this.sessionId;
  }

  /**
   * セッションIDを初期化する
   * localStorage から既存のIDを取得するか、新しいIDを生成する
   * ログイン状態に関係なく同一ブラウザでは同じIDを維持
   */
  private initializeSessionId(): string {
    if (typeof window === "undefined") {
      return this.generateSessionId();
    }

    const SESSION_ID_KEY = "civicship_auth_session_id";

    try {
      let sessionId = localStorage.getItem(SESSION_ID_KEY);

      if (!sessionId) {
        sessionId = this.generateSessionId();
        localStorage.setItem(SESSION_ID_KEY, sessionId);
      }

      return sessionId;
    } catch (error) {
      return this.generateSessionId();
    }
  }

  /**
   * セッションIDを生成する
   */
  private generateSessionId(): string {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return `auth_${Date.now()}_${crypto.randomUUID().replace(/-/g, "").substring(0, 9)}`;
    } else if (typeof crypto !== "undefined" && crypto.getRandomValues) {
      const array = new Uint32Array(1);
      crypto.getRandomValues(array);
      return `auth_${Date.now()}_${array[0].toString(36)}`;
    } else {
      return `auth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
  }

  /**
   * 認証状態の変更を監視するリスナーを追加
   */
  public addStateChangeListener(listener: AuthStateChangeListener): void {
    this.stateChangeListeners.push(listener);
  }

  /**
   * 認証状態の変更を監視するリスナーを削除
   */
  public removeStateChangeListener(listener: AuthStateChangeListener): void {
    this.stateChangeListeners = this.stateChangeListeners.filter((l) => l !== listener);
  }

  public subscribe(listener: AuthStateChangeListener): () => void {
    this.stateChangeListeners.push(listener);
    return () => {
      this.stateChangeListeners = this.stateChangeListeners.filter(l => l !== listener);
    };
  }

  public updateUserData(firebaseUser: any, currentUser: any): void {
    this.setStateInternal({
      firebaseUser,
      currentUser
    });
  }

  private setStateInternal(newState: Partial<AuthState>): void {
    const prevState = { ...this.state };
    this.state = { ...this.state, ...newState };
    
    if (JSON.stringify(prevState) !== JSON.stringify(this.state)) {
      this.notifyStateChange();
    }
  }

  private setLoading(isLoading: boolean, phase: LoadingState["phase"]): void {
    this.setStateInternal({
      loading: { isLoading, phase }
    });
  }

  public setState(state: LegacyAuthenticationState): void {
    logger.debug("AuthStateManager.setState (legacy)", {
      from: this.getLegacyState(),
      to: state,
      component: "AuthStateManager",
    });
    
    switch (state) {
      case "loading":
        this.setLoading(true, "initializing");
        break;
      case "unauthenticated":
        this.setStateInternal({ authentication: "unauthenticated", loading: { isLoading: false, phase: "idle" } });
        break;
      case "line_authenticated":
        this.setStateInternal({ authentication: "line_authenticated", tokenStatus: { ...this.state.tokenStatus, lineTokenExpired: false } });
        break;
      case "line_token_expired":
        this.setStateInternal({ tokenStatus: { ...this.state.tokenStatus, lineTokenExpired: true } });
        break;
      case "phone_authenticated":
        this.setStateInternal({ authentication: "phone_authenticated", tokenStatus: { ...this.state.tokenStatus, phoneTokenExpired: false } });
        break;
      case "phone_token_expired":
        this.setStateInternal({ tokenStatus: { ...this.state.tokenStatus, phoneTokenExpired: true } });
        break;
      case "user_registered":
        this.setStateInternal({ authentication: "user_registered" });
        break;
    }
  }

  /**
   * 認証状態の変更を通知
   */
  private notifyStateChange(): void {
    this.stateChangeListeners.forEach((listener) => {
      listener(this.getState());
    });
  }

  /**
   * 認証状態を初期化
   */
  public async initialize(): Promise<void> {
    this.setLoading(true, "initializing");

    try {
      this.setLoading(true, "checking_line");
      const lineTokens = TokenManager.getLineTokens();
      const hasValidLineToken = lineTokens.accessToken && !(await TokenManager.isLineTokenExpired());

      if (!hasValidLineToken) {
        this.setStateInternal({ authentication: "unauthenticated" });
        return;
      }

      this.setLoading(true, "checking_user");
      const isUserRegistered = await this.checkUserRegistration();

      if (isUserRegistered) {
        this.setStateInternal({ authentication: "user_registered" });
        return;
      }

      this.setLoading(true, "checking_phone");
      const phoneTokens = TokenManager.getPhoneTokens();
      const hasValidPhoneToken = phoneTokens.accessToken && !(await TokenManager.isPhoneTokenExpired());

      if (hasValidPhoneToken) {
        this.setStateInternal({ authentication: "phone_authenticated" });
      } else {
        this.setStateInternal({ authentication: "line_authenticated" });
      }

    } catch (error) {
      logger.error("Authentication initialization failed", {
        error: error instanceof Error ? error.message : String(error),
        component: "AuthStateManager",
      });
      this.setStateInternal({ 
        authentication: "unauthenticated",
        error: {
          type: "auth_failed",
          source: "line",
          message: error instanceof Error ? error.message : "Unknown error",
          recoverable: true
        }
      });
    } finally {
      this.setLoading(false, "idle");
    }
  }

  /**
   * ユーザー情報の登録状態を確認
   * Firebase Authの状態も考慮してより確実にチェック
   */
  private async checkUserRegistration(): Promise<boolean> {
    try {
      const { lineAuth } = await import("./firebase-config");
      if (!lineAuth.currentUser) {
        logger.debug("No Firebase Auth user found", {
          component: "AuthStateManager",
        });
        return false;
      }

      let accessToken = null;
      try {
        accessToken = await lineAuth.currentUser.getIdToken();
      } catch (tokenError) {
        logger.info("Failed to get Firebase token for user registration check", {
          error: tokenError instanceof Error ? tokenError.message : String(tokenError),
          component: "AuthStateManager",
        });
        return false;
      }

      const { data } = await apolloClient.query({
        query: GET_CURRENT_USER,
        fetchPolicy: "network-only",
        context: {
          headers: {
            Authorization: accessToken ? `Bearer ${accessToken}` : "",
          },
        },
      });

      const isRegistered = data?.currentUser?.user != null;
      logger.debug("User registration check result", {
        hasFirebaseUser: !!lineAuth.currentUser,
        hasAccessToken: !!accessToken,
        isRegistered,
        userId: data?.currentUser?.user?.id || null,
        component: "AuthStateManager",
      });

      return isRegistered;
    } catch (error) {
      logger.info("Failed to check user registration", {
        error: error instanceof Error ? error.message : String(error),
        component: "AuthStateManager",
      });
      return false;
    }
  }

  /**
   * LINEトークン更新イベントのハンドラー
   */
  private async handleLineTokenRenewal(event: Event): Promise<void> {
    try {
      this.setStateInternal({ tokenStatus: { ...this.state.tokenStatus, lineTokenExpired: true } });
      
      const renewed = await TokenManager.renewLineToken();

      if (renewed) {
        this.setStateInternal({ tokenStatus: { ...this.state.tokenStatus, lineTokenExpired: false } });
        
        const isUserRegistered = await this.checkUserRegistration();
        if (isUserRegistered) {
          this.setStateInternal({ authentication: "user_registered" });
        } else {
          this.setStateInternal({ authentication: "line_authenticated" });
        }
      } else {
        this.setStateInternal({ authentication: "unauthenticated" });
      }
    } catch (error) {
      logger.info("Failed to renew LINE token", {
        error: error instanceof Error ? error.message : String(error),
        component: "AuthStateManager",
      });
      this.setStateInternal({ authentication: "unauthenticated" });
    }
  }

  /**
   * 電話番号トークン更新イベントのハンドラー
   */
  private async handlePhoneTokenRenewal(event: Event): Promise<void> {
    try {
      this.setStateInternal({ tokenStatus: { ...this.state.tokenStatus, phoneTokenExpired: true } });
      
      const renewed = await TokenManager.renewPhoneToken();
      const lineTokens = TokenManager.getLineTokens();
      const hasValidLineToken = lineTokens.accessToken && !(await TokenManager.isLineTokenExpired());

      if (renewed) {
        this.setStateInternal({ 
          tokenStatus: { ...this.state.tokenStatus, phoneTokenExpired: false },
          authentication: "phone_authenticated"
        });
      } else if (!hasValidLineToken) {
        this.setStateInternal({ authentication: "unauthenticated" });
      } else {
        this.setStateInternal({ authentication: "line_authenticated" });
      }
    } catch (error) {
      logger.info("Failed to renew phone token", {
        authType: "phone",
        error: error instanceof Error ? error.message : String(error),
        component: "AuthStateManager",
      });

      const lineTokens = TokenManager.getLineTokens();
      const hasValidLineToken = lineTokens.accessToken && !(await TokenManager.isLineTokenExpired());
      
      this.setStateInternal({ 
        authentication: hasValidLineToken ? "line_authenticated" : "unauthenticated"
      });
    }
  }

  /**
   * LINE認証状態の変更を処理
   */
  public async handleLineAuthStateChange(isAuthenticated: boolean): Promise<void> {
    if (isAuthenticated) {
      if (this.state.authentication === "unauthenticated" || this.state.loading.isLoading) {
        this.setStateInternal({ authentication: "line_authenticated" });
      }
    } else {
      this.setStateInternal({ authentication: "unauthenticated" });
    }
  }

  /**
   * 電話番号認証状態の変更を処理
   */
  public async handlePhoneAuthStateChange(isVerified: boolean): Promise<void> {
    const lineTokens = TokenManager.getLineTokens();
    const hasValidLineToken = !!lineTokens.accessToken && !(await TokenManager.isLineTokenExpired());

    if (!hasValidLineToken && !this.state.loading.isLoading) {
      this.setStateInternal({ authentication: "unauthenticated" });
      return;
    }

    if (isVerified) {
      if (
        this.state.authentication === "line_authenticated" ||
        this.state.tokenStatus.lineTokenExpired
      ) {
        this.setStateInternal({ authentication: "phone_authenticated" });
      }
    } else {
      if (this.state.authentication !== "unauthenticated" && !this.state.loading.isLoading) {
        this.setStateInternal({ authentication: "line_authenticated" });
      }
    }
  }

  /**
   * ユーザー情報登録状態の変更を処理
   */
  public async handleUserRegistrationStateChange(isRegistered: boolean): Promise<void> {
    const lineTokens = TokenManager.getLineTokens();
    const hasValidLineToken = lineTokens.accessToken && !(await TokenManager.isLineTokenExpired());

    if (!hasValidLineToken) {
      this.setStateInternal({ authentication: "unauthenticated" });
      return;
    }

    if (isRegistered) {
      this.setStateInternal({ authentication: "user_registered" });
      logger.debug(
        "User is registered - setting state to user_registered regardless of phone token status",
        {
          component: "AuthStateManager",
        },
      );
    } else {
      const phoneTokens = TokenManager.getPhoneTokens();
      const hasValidPhoneToken =
        phoneTokens.accessToken && !(await TokenManager.isPhoneTokenExpired());

      if (hasValidPhoneToken) {
        this.setStateInternal({ authentication: "phone_authenticated" });
      } else {
        this.setStateInternal({ authentication: "line_authenticated" });
      }
    }
  }
}
