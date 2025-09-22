import { TokenManager } from "./token-manager";
import { apolloClient } from "@/lib/apollo";
import { GET_CURRENT_USER } from "@/graphql/account/identity/query";

import { logger } from "@/lib/logging";

export type AuthenticationState =
  | "initializing"
  | "verifying"
  | "network_error"
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
  private currentState: AuthenticationState = "initializing";
  private stateChangeListeners: ((state: AuthenticationState) => void)[] = [];
  private readonly sessionId: string;
  private networkErrorListener: ((event: CustomEvent) => void) | null = null;
  private isInitializing: boolean = false;
  private initializationPromise: Promise<void> | null = null;

  private constructor() {
    this.sessionId = this.initializeSessionId();
    this.setupNetworkErrorListener();
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
  public addStateChangeListener(listener: (state: AuthenticationState) => void): void {
    this.stateChangeListeners.push(listener);
  }

  /**
   * 認証状態の変更を監視するリスナーを削除
   */
  public removeStateChangeListener(listener: (state: AuthenticationState) => void): void {
    this.stateChangeListeners = this.stateChangeListeners.filter((l) => l !== listener);
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
    this.stateChangeListeners.forEach((listener) => {
      listener(this.currentState);
    });
  }

  /**
   * Setup network error listener to handle Apollo GraphQL network failures
   */
  private setupNetworkErrorListener(): void {
    if (typeof window === "undefined") return;
    
    this.networkErrorListener = (event: CustomEvent) => {
      const { operation, error } = event.detail;
      
      if (operation === "getCurrentUser" || operation === "GET_CURRENT_USER") {
        logger.warn("AuthStateManager: Network error during user registration check via Apollo", {
          error,
          operation,
          component: "AuthStateManager",
          timestamp: new Date().toISOString(),
          currentState: this.currentState,
        });
        
        if (this.currentState !== "network_error") {
          this.setState("network_error");
        }
      }
    };
    
    window.addEventListener("auth:network-error", this.networkErrorListener as EventListener);
  }

  /**
   * Cleanup network error listener
   */
  private cleanupNetworkErrorListener(): void {
    if (typeof window !== "undefined" && this.networkErrorListener) {
      window.removeEventListener("auth:network-error", this.networkErrorListener as EventListener);
      this.networkErrorListener = null;
    }
  }

  /**
   * Retry authentication initialization after network error
   */
  public async retryInitialization(): Promise<void> {
    if (this.currentState === "network_error") {
      logger.debug("AuthStateManager: Retrying initialization after network error", {
        component: "AuthStateManager",
        timestamp: new Date().toISOString(),
      });
      await this.initialize();
    }
  }


  /**
   * 認証状態を初期化
   */
  public async initialize(): Promise<void> {
    if (this.initializationPromise) {
      console.log("🔄 AuthStateManager: Returning existing initialization promise", {
        sessionId: this.sessionId,
        currentState: this.currentState,
        timestamp: new Date().toISOString(),
      });
      return this.initializationPromise;
    }

    if (this.isInitializing) {
      console.log("🔄 AuthStateManager: Initialization already in progress", {
        sessionId: this.sessionId,
        currentState: this.currentState,
        isInitializing: this.isInitializing,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    this.initializationPromise = this.performInitialization();
    return this.initializationPromise;
  }

  private async performInitialization(): Promise<void> {
    this.isInitializing = true;

    try {
      logger.debug("AuthStateManager: Starting initialization", {
        component: "AuthStateManager",
        timestamp: new Date().toISOString(),
        sessionId: this.sessionId,
      });
      
      console.log("🔄 AuthStateManager: Starting initialization", {
        sessionId: this.sessionId,
        currentState: this.currentState,
        timestamp: new Date().toISOString(),
      });
      
      this.setState("initializing");
      console.log("🔄 AuthStateManager: Set state to initializing");

      const lineTokens = TokenManager.getLineTokens();
      const hasValidLineToken = lineTokens.accessToken && !(await TokenManager.isLineTokenExpired());

      logger.debug("AuthStateManager: Line token check completed", {
        component: "AuthStateManager",
        timestamp: new Date().toISOString(),
        hasValidLineToken,
        hasAccessToken: !!lineTokens.accessToken,
      });

      if (!hasValidLineToken) {
        this.setState("unauthenticated");
        return;
      }

      logger.debug("AuthStateManager: Starting user registration check", {
        component: "AuthStateManager",
        timestamp: new Date().toISOString(),
      });

      this.setState("verifying");
      console.log("🔍 AuthStateManager: Set state to verifying - starting user registration check");

      let retryCount = 0;
      const maxRetries = 3;
      let isUserRegistered = false;
      
      while (retryCount < maxRetries) {
        try {
          isUserRegistered = await this.checkUserRegistration();
          break; // Success, exit retry loop
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          
          if (errorMessage.startsWith("NETWORK_ERROR:")) {
            retryCount++;
            logger.warn(`AuthStateManager: Network error during initialization (attempt ${retryCount}/${maxRetries})`, {
              error: errorMessage,
              component: "AuthStateManager",
              timestamp: new Date().toISOString(),
              retryCount,
            });
            
            if (retryCount >= maxRetries) {
              logger.warn("AuthStateManager: Max retries reached, setting network_error state", {
                component: "AuthStateManager",
                timestamp: new Date().toISOString(),
                maxRetries,
              });
              this.setState("network_error");
              return;
            }
            
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
          } else {
            // For non-network errors, set unauthenticated state and exit retry loop
            logger.error("AuthStateManager: Non-network error during initialization", {
              error: errorMessage,
              component: "AuthStateManager",
              timestamp: new Date().toISOString(),
            });
            this.setState("unauthenticated");
            return;
          }
        }
      }

      logger.debug("AuthStateManager: User registration check completed", {
        component: "AuthStateManager",
        timestamp: new Date().toISOString(),
        isUserRegistered,
        retryCount,
      });

      if (isUserRegistered) {
        console.log("✅ AuthStateManager: User is registered, setting state to user_registered");
        this.setState("user_registered");
      } else {
        console.log("❌ AuthStateManager: User is not registered, checking phone tokens");
        const phoneTokens = TokenManager.getPhoneTokens();
        const hasValidPhoneToken =
          phoneTokens.accessToken && !(await TokenManager.isPhoneTokenExpired());

        if (hasValidPhoneToken) {
          console.log("📱 AuthStateManager: Valid phone token found, setting state to phone_authenticated");
          this.setState("phone_authenticated");
        } else {
          console.log("📱 AuthStateManager: No valid phone token, setting state to line_authenticated");
          this.setState("line_authenticated");
        }
      }

      logger.debug("AuthStateManager: Initialization completed successfully", {
        component: "AuthStateManager",
        timestamp: new Date().toISOString(),
        finalState: this.currentState,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      logger.error("AuthStateManager: Initialization failed", {
        error: errorMessage,
        component: "AuthStateManager",
        timestamp: new Date().toISOString(),
        sessionId: this.sessionId,
      });
      throw error;
    } finally {
      this.isInitializing = false;
      this.initializationPromise = null;
    }
  }


  /**
   * ユーザー情報の登録状態を確認
   * Firebase Authの状態も考慮してより確実にチェック
   */
  private async checkUserRegistration(): Promise<boolean> {
    try {
      console.log("🔍 AuthStateManager: Starting checkUserRegistration");
      logger.debug("AuthStateManager: Starting user registration check", {
        component: "AuthStateManager",
        timestamp: new Date().toISOString(),
      });

      const { lineAuth } = await import("./firebase-config");
      if (!lineAuth.currentUser) {
        logger.debug("AuthStateManager: No Firebase current user", {
          component: "AuthStateManager",
          timestamp: new Date().toISOString(),
        });
        return false;
      }

      let accessToken = null;
      try {
        accessToken = await lineAuth.currentUser.getIdToken();
        logger.debug("AuthStateManager: Firebase token obtained", {
          component: "AuthStateManager",
          timestamp: new Date().toISOString(),
          hasToken: !!accessToken,
        });
      } catch (tokenError) {
        logger.info("Failed to get Firebase token for user registration check", {
          error: tokenError instanceof Error ? tokenError.message : String(tokenError),
          component: "AuthStateManager",
          timestamp: new Date().toISOString(),
        });
        return false;
      }

      logger.debug("AuthStateManager: Making GraphQL request", {
        component: "AuthStateManager",
        timestamp: new Date().toISOString(),
        hasAccessToken: !!accessToken,
      });

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("NETWORK_TIMEOUT: GraphQL request timed out")), 5000);
      });

      const queryPromise = apolloClient.query({
        query: GET_CURRENT_USER,
        fetchPolicy: "network-only",
        errorPolicy: "none",
        context: {
          headers: {
            Authorization: accessToken ? `Bearer ${accessToken}` : "",
            "X-Civicship-Tenant": process.env.NEXT_PUBLIC_FIREBASE_AUTH_TENANT_ID,
            "X-Community-Id": process.env.NEXT_PUBLIC_COMMUNITY_ID,
          },
        },
      });

      const { data } = await Promise.race([queryPromise, timeoutPromise]) as any;

      const isRegistered = data?.currentUser?.user != null;
      
      console.log("📊 AuthStateManager: GraphQL request completed", {
        isRegistered,
        hasUserData: !!data?.currentUser?.user,
        data: data?.currentUser,
      });
      
      logger.debug("AuthStateManager: GraphQL request completed", {
        component: "AuthStateManager",
        timestamp: new Date().toISOString(),
        isRegistered,
        hasUserData: !!data?.currentUser?.user,
      });

      return isRegistered;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      const isNetworkError = errorMessage.includes("Failed to fetch") || 
                             errorMessage.includes("Load failed") || 
                             errorMessage.includes("Network request failed") ||
                             errorMessage.includes("ERR_CONNECTION_REFUSED") ||
                             errorMessage.includes("NetworkError") ||
                             errorMessage.includes("NETWORK_TIMEOUT") ||
                             errorMessage.includes("fetch") ||
                             errorMessage.includes("Connection refused") ||
                             errorMessage.includes("ECONNREFUSED") ||
                             (error as any)?.networkError ||
                             (error as any)?.code === "NETWORK_ERROR";
      
      if (isNetworkError) {
        console.log("🚨 AuthStateManager: Network error detected", {
          error: errorMessage,
          errorType: "network_connectivity",
          currentState: this.currentState,
        });
        
        logger.warn("AuthStateManager: Network error during user registration check", {
          error: errorMessage,
          component: "AuthStateManager",
          timestamp: new Date().toISOString(),
          errorType: "network_connectivity",
          currentState: this.currentState,
        });
        
        if (this.currentState !== "network_error") {
          console.log("🚨 AuthStateManager: Setting state to network_error");
          this.setState("network_error");
        }
        
        throw new Error(`NETWORK_ERROR: ${errorMessage}`);
      }
      
      console.log("❌ AuthStateManager: Non-network error during user registration check", {
        error: errorMessage,
        isNetworkError: false,
      });
      
      logger.info("AuthStateManager: Failed to check user registration", {
        error: errorMessage,
        component: "AuthStateManager",
        timestamp: new Date().toISOString(),
      });
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
        const isUserRegistered = await this.checkUserRegistration();
        if (isUserRegistered) {
          this.setState("user_registered");
        } else {
          this.setState("line_authenticated");
        }
      } else if (!renewed) {
        this.setState("unauthenticated");
      }
    } catch (error) {
      logger.info("Failed to renew LINE token", {
        error: error instanceof Error ? error.message : String(error),
        component: "AuthStateManager",
      });
      this.setState("unauthenticated");
    }
  }

  /**
   * 電話番号トークン更新イベントのハンドラー
   */
  private async handlePhoneTokenRenewal(event: Event): Promise<void> {
    try {
      const renewed = await TokenManager.renewPhoneToken();
      const lineTokens = TokenManager.getLineTokens();
      const hasValidLineToken =
        lineTokens.accessToken && !(await TokenManager.isLineTokenExpired());

      if (renewed && this.currentState === "phone_token_expired") {
        this.setState("phone_authenticated");
      } else if (!renewed) {
        if (!hasValidLineToken) {
          this.setState("unauthenticated");
        } else {
          this.setState("line_authenticated");
        }
      }
    } catch (error) {
      logger.info("Failed to renew phone token", {
        authType: "phone",
        error: error instanceof Error ? error.message : String(error),
        component: "AuthStateManager",
      });

      const lineTokens = TokenManager.getLineTokens();
      const hasValidLineToken =
        lineTokens.accessToken && !(await TokenManager.isLineTokenExpired());

      if (!hasValidLineToken) {
        this.setState("unauthenticated");
      } else {
        this.setState("line_authenticated");
      }
    }
  }

  /**
   * LINE認証状態の変更を処理
   */
  public async handleLineAuthStateChange(isAuthenticated: boolean): Promise<void> {
    if (isAuthenticated) {
      if (this.currentState === "unauthenticated" || this.currentState === "loading" || this.currentState === "initializing") {
        this.setState("line_authenticated");
      }
    } else {
      this.setState("unauthenticated");
    }
  }

  /**
   * 電話番号認証状態の変更を処理
   */
  public async handlePhoneAuthStateChange(isVerified: boolean): Promise<void> {
    const lineTokens = TokenManager.getLineTokens();
    const hasValidLineToken = !!lineTokens.accessToken && !(await TokenManager.isLineTokenExpired());

    if (!hasValidLineToken && this.currentState !== "loading" && this.currentState !== "initializing" && this.currentState !== "network_error") {
      this.setState("unauthenticated");
      return;
    }

    if (isVerified) {
      if (
        this.currentState === "line_authenticated" ||
        this.currentState === "line_token_expired"
      ) {
        this.setState("phone_authenticated");
      }
    } else {
      if (this.currentState !== "unauthenticated" && this.currentState !== "loading" && this.currentState !== "initializing" && this.currentState !== "network_error") {
        this.setState("line_authenticated");
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
      this.setState("unauthenticated");
      return;
    }

    if (isRegistered) {
      this.setState("user_registered");
    } else {
      const phoneTokens = TokenManager.getPhoneTokens();
      const hasValidPhoneToken =
        phoneTokens.accessToken && !(await TokenManager.isPhoneTokenExpired());

      if (hasValidPhoneToken) {
        this.setState("phone_authenticated");
      } else {
        this.setState("line_authenticated");
      }
    }
  }
}
