import { TokenManager } from "./token-manager";
import { apolloClient } from "@/lib/apollo";
import { GET_CURRENT_USER, GET_CURRENT_USER_WITH_IDENTITIES } from "@/graphql/account/identity/query";

import { logger } from "@/lib/logging";

export type AuthenticationState =
  | "loading"
  | "unauthenticated"
  | "partial"
  | "authenticated";

/**
 * 認証状態の管理を担当するクラス
 * 認証状態の遷移ロジックを集約し、他のコンポーネントから参照できるようにする
 */
export class AuthStateManager {
  private static instance: AuthStateManager;
  private currentState: AuthenticationState = "loading";
  private stateChangeListeners: ((state: AuthenticationState) => void)[] = [];
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
   * 認証状態を初期化
   */
  public async initialize(): Promise<void> {
    try {
      this.setState("loading");

      const lineTokens = TokenManager.getLineTokens();
      const hasValidLineToken = lineTokens.accessToken && !(await TokenManager.isLineTokenExpired());

      if (!hasValidLineToken) {
        this.setState("unauthenticated");
        return;
      }

      const hasLineIdentityForTenant = await this.checkLineIdentityForCurrentTenant();
      
      if (hasLineIdentityForTenant) {
        this.setState("authenticated");
      } else {
        const phoneTokens = TokenManager.getPhoneTokens();
        const hasValidPhoneToken =
          phoneTokens.accessToken && !(await TokenManager.isPhoneTokenExpired());

        if (hasValidPhoneToken) {
          this.setState("partial");
        } else {
          this.setState("partial");
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error("Auth initialization failed", {
        error: errorMessage,
        component: "AuthStateManager"
      });
      throw error;
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
   * 現在のテナントに対するLINE Identityの存在を確認
   */
  private async checkLineIdentityForCurrentTenant(): Promise<boolean> {
    try {
      const { lineAuth } = await import("./firebase-config");
      if (!lineAuth.currentUser) {
        return false;
      }

      let accessToken = null;
      try {
        accessToken = await lineAuth.currentUser.getIdToken();
      } catch (tokenError) {
        logger.info("Failed to get Firebase token for LINE identity check", {
          error: tokenError instanceof Error ? tokenError.message : String(tokenError),
          component: "AuthStateManager",
        });
        return false;
      }

      const { data } = await apolloClient.query({
        query: GET_CURRENT_USER_WITH_IDENTITIES,
        fetchPolicy: "network-only",
        context: {
          headers: {
            Authorization: accessToken ? `Bearer ${accessToken}` : "",
          },
        },
      });

      const user = data?.currentUser?.user;
      if (!user || !user.identities) {
        return false;
      }

      const hasLineIdentity = user.identities.some(
        (identity: any) => identity.platform === "LINE"
      );

      logger.info("LINE identity check completed", {
        hasLineIdentity,
        component: "AuthStateManager",
      });

      return hasLineIdentity;
    } catch (error) {
      logger.info("Failed to check LINE identity for current tenant", {
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
      const renewed = await TokenManager.renewLineToken();

      if (renewed) {
        const isUserRegistered = await this.checkUserRegistration();
        if (isUserRegistered) {
          this.setState("authenticated");
        } else {
          this.setState("partial");
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

      if (renewed) {
        const isUserRegistered = await this.checkUserRegistration();
        if (isUserRegistered) {
          this.setState("authenticated");
        } else {
          this.setState("partial");
        }
      } else if (!renewed) {
        if (!hasValidLineToken) {
          this.setState("unauthenticated");
        } else {
          this.setState("partial");
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
        this.setState("partial");
      }
    }
  }

  /**
   * LINE認証状態の変更を処理
   */
  public async handleLineAuthStateChange(isAuthenticated: boolean): Promise<void> {
    if (isAuthenticated) {
      if (this.currentState === "unauthenticated" || this.currentState === "loading") {
        const hasLineIdentityForTenant = await this.checkLineIdentityForCurrentTenant();
        if (hasLineIdentityForTenant) {
          this.setState("authenticated");
        } else {
          this.setState("partial");
        }
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

    if (!hasValidLineToken && this.currentState !== "loading") {
      this.setState("unauthenticated");
      return;
    }

    if (isVerified) {
      if (this.currentState === "partial") {
        const hasLineIdentityForTenant = await this.checkLineIdentityForCurrentTenant();
        if (hasLineIdentityForTenant) {
          this.setState("authenticated");
        } else {
          this.setState("partial");
        }
      }
    } else {
      if (this.currentState !== "unauthenticated" && this.currentState !== "loading") {
        this.setState("partial");
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
      const hasLineIdentityForTenant = await this.checkLineIdentityForCurrentTenant();
      if (hasLineIdentityForTenant) {
        this.setState("authenticated");
      } else {
        this.setState("partial");
      }
    } else {
      const phoneTokens = TokenManager.getPhoneTokens();
      const hasValidPhoneToken =
        phoneTokens.accessToken && !(await TokenManager.isPhoneTokenExpired());

      if (hasValidPhoneToken) {
        this.setState("partial");
      } else {
        this.setState("partial");
      }
    }
  }

  /**
   * 現在の認証状態が完全に認証済みかどうかを判定
   */
  public isFullyAuthenticated(): boolean {
    return this.currentState === "authenticated";
  }

  /**
   * 現在の認証状態がLINE認証済みかどうかを判定
   */
  public isLineAuthenticated(): boolean {
    const lineTokens = TokenManager.getLineTokens();
    return lineTokens && !TokenManager.isLineTokenExpired() && 
           (this.currentState === "partial" || this.currentState === "authenticated");
  }

  /**
   * 現在の認証状態が電話番号認証済みかどうかを判定
   */
  public isPhoneAuthenticated(): boolean {
    const phoneTokens = TokenManager.getPhoneTokens();
    return phoneTokens && !TokenManager.isPhoneTokenExpired() && 
           (this.currentState === "partial" || this.currentState === "authenticated");
  }

  /**
   * 現在の認証状態が未認証かどうかを判定
   */
  public isUnauthenticated(): boolean {
    return this.currentState === "unauthenticated";
  }

  /**
   * 現在の認証状態が部分認証かどうかを判定
   */
  public isPartiallyAuthenticated(): boolean {
    return this.currentState === "partial";
  }

  /**
   * 認証が必要かどうかを判定
   */
  public needsAuthentication(): boolean {
    return this.currentState === "unauthenticated" || this.currentState === "partial";
  }
}
