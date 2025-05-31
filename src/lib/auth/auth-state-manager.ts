import { TokenManager } from "./token-manager";
import { apolloClient } from "@/lib/apollo";
import { GET_CURRENT_USER } from "@/graphql/account/identity/query";
import clientLogger from "../logging/client";
import { createAuthLogContext, generateSessionId } from "../logging/client/utils";

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
  private stateChangeListeners: ((state: AuthenticationState) => void)[] = [];

  private constructor() {
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
    clientLogger.debug("AuthStateManager.setState", {
      from: this.currentState,
      to: state,
      component: "AuthStateManager"
    });
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
    const hasValidLineToken = lineTokens.accessToken && !(await TokenManager.isLineTokenExpired());

    if (!hasValidLineToken) {
      this.setState("unauthenticated");
      return;
    } else {
      const isUserRegistered = await this.checkUserRegistration();

      if (isUserRegistered) {
        this.setState("user_registered");
      } else {
        const phoneTokens = TokenManager.getPhoneTokens();
        const hasValidPhoneToken = phoneTokens.accessToken && !(await TokenManager.isPhoneTokenExpired());

        if (hasValidPhoneToken) {
          this.setState("phone_authenticated");
        } else {
          this.setState("line_authenticated");
        }
      }
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
        clientLogger.debug("No Firebase Auth user found", {
          component: "AuthStateManager"
        });
        return false;
      }

      let accessToken = null;
      try {
        accessToken = await lineAuth.currentUser.getIdToken();
      } catch (tokenError) {
        clientLogger.info("Failed to get Firebase token for user registration check", createAuthLogContext(
          generateSessionId(),
          "general",
          { 
            error: tokenError instanceof Error ? tokenError.message : String(tokenError),
            component: "AuthStateManager" 
          }
        ));
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
      clientLogger.debug("User registration check result", {
        hasFirebaseUser: !!lineAuth.currentUser,
        hasAccessToken: !!accessToken,
        isRegistered,
        userId: data?.currentUser?.user?.id || null,
        component: "AuthStateManager"
      });

      return isRegistered;
    } catch (error) {
      clientLogger.info("Failed to check user registration", createAuthLogContext(
        generateSessionId(),
        "general",
        { 
          error: error instanceof Error ? error.message : String(error),
          component: "AuthStateManager" 
        }
      ));
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
      clientLogger.info("Failed to renew LINE token", createAuthLogContext(
        generateSessionId(),
        "general",
        { 
          error: error instanceof Error ? error.message : String(error),
          component: "AuthStateManager" 
        }
      ));
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
      const hasValidLineToken = lineTokens.accessToken && !(await TokenManager.isLineTokenExpired());

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
      clientLogger.info("Failed to renew phone token", createAuthLogContext(
        generateSessionId(),
        "general",
        { 
          error: error instanceof Error ? error.message : String(error),
          component: "AuthStateManager" 
        }
      ));

      const lineTokens = TokenManager.getLineTokens();
      const hasValidLineToken = lineTokens.accessToken && !(await TokenManager.isLineTokenExpired());

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
  public async handlePhoneAuthStateChange(isVerified: boolean): Promise<void> {
    const lineTokens = TokenManager.getLineTokens();
    const hasValidLineToken = lineTokens.accessToken && !(await TokenManager.isLineTokenExpired());

    if (!hasValidLineToken && this.currentState !== "loading") {
      this.setState("unauthenticated");
      return;
    }

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
  public async handleUserRegistrationStateChange(isRegistered: boolean): Promise<void> {
    const lineTokens = TokenManager.getLineTokens();
    const hasValidLineToken = lineTokens.accessToken && !(await TokenManager.isLineTokenExpired());

    if (!hasValidLineToken) {
      this.setState("unauthenticated");
      return;
    }

    if (isRegistered) {
      this.setState("user_registered");
      clientLogger.debug("User is registered - setting state to user_registered regardless of phone token status", {
        component: "AuthStateManager"
      });
    } else {
      const phoneTokens = TokenManager.getPhoneTokens();
      const hasValidPhoneToken = phoneTokens.accessToken && !(await TokenManager.isPhoneTokenExpired());

      if (hasValidPhoneToken) {
        this.setState("phone_authenticated");
      } else {
        this.setState("line_authenticated");
      }
    }
  }
}
