"use client";

import liff from "@line/liff";
import { signInWithCustomToken, updateProfile } from "firebase/auth";
import { categorizeFirebaseError, lineAuth } from "./firebase-config";
import { AuthTokens, TokenManager } from "./token-manager";
import retry from "retry";
import clientLogger from "../logging/client";
import { createAuthLogContext, generateSessionId } from "../logging/client/utils";

/**
 * LIFF初期化状態の型定義
 */
export type LiffState = {
  isInitialized: boolean;
  isLoggedIn: boolean;
  profile: {
    userId: string | null;
    displayName: string | null;
    pictureUrl: string | null;
  };
  error: Error | null;
};

/**
 * LIFF認証サービス
 */
export class LiffService {
  private static instance: LiffService;
  private liffId: string;
  private state: LiffState;
  private initializing = false;

  /**
   * コンストラクタ
   * @param liffId LIFF ID
   */
  private constructor(liffId: string) {
    this.liffId = liffId;
    this.state = {
      isInitialized: false,
      isLoggedIn: false,
      profile: {
        userId: null,
        displayName: null,
        pictureUrl: null,
      },
      error: null,
    };
  }

  public getLiffUrl(redirectPath?: string): string {
    const baseUrl = `https://liff.line.me/${this.liffId}`;
    if (!redirectPath) return baseUrl;

    const encodedNext = encodeURIComponent(redirectPath);
    return `${baseUrl}?next=${encodedNext}`;
  }

  /**
   * シングルトンインスタンスを取得
   * @param liffId LIFF ID（初回のみ必要）
   * @returns LiffServiceのインスタンス
   */
  public static getInstance(liffId?: string): LiffService {
    if (!LiffService.instance) {
      if (!liffId) {
        throw new Error("LIFF ID is required for the first initialization");
      }
      LiffService.instance = new LiffService(liffId);
    }
    return LiffService.instance;
  }

  /**
   * LIFF SDKを初期化
   * @returns 初期化が成功したかどうか
   */
  public async initialize(): Promise<boolean> {
    clientLogger.debug("Calling liffService.initialize()", { component: "LiffService" });
    try {
      if (this.state.isInitialized) {
        clientLogger.debug("Already initialized, skipping", { component: "LiffService" });
        return true;
      }
      if (this.initializing) {
        clientLogger.debug("Already initializing, skipping", { component: "LiffService" });
        return true;
      }
      this.initializing = true;

      await liff.init({ liffId: this.liffId });
      this.state.isInitialized = true;
      this.state.isLoggedIn = liff.isLoggedIn();

      if (this.state.isLoggedIn) {
        await this.updateProfile();
      }

      clientLogger.debug("liffService.initialize() success", { 
        isInitialized: this.state.isInitialized,
        component: "LiffService" 
      });

      return true;
    } catch (error) {
      clientLogger.info("LIFF initialization error", createAuthLogContext(
        generateSessionId(),
        "liff",
        { 
          error: error instanceof Error ? error.message : String(error),
          component: "LiffService" 
        }
      ));
      this.state.error = error as Error;
      return false;
    } finally {
      this.initializing = false;
    }
  }

  /**
   * LIFFでログイン
   * @param redirectPath リダイレクト先のパス（オプション）
   * @returns ログインが成功したかどうか
   */
  public async login(redirectPath?: string): Promise<boolean> {
    try {
      if (!this.state.isInitialized) {
        await this.initialize();
      }

      if (liff.isInClient()) {
        this.state.isLoggedIn = true;
      } else {
        const redirectUri =
          redirectPath && typeof window !== "undefined"
            ? window.location.origin + redirectPath
            : typeof window !== "undefined"
              ? window.location.pathname
              : undefined;

        liff.login({ redirectUri });
        return false; // リダイレクトするのでここには到達しない
      }

      await this.updateProfile();
      return true;
    } catch (error) {
      clientLogger.info("LIFF login error", createAuthLogContext(
        generateSessionId(),
        "liff",
        { 
          error: error instanceof Error ? error.message : String(error),
          component: "LiffService" 
        }
      ));
      this.state.error = error as Error;
      return false;
    }
  }

  /**
   * LIFFからログアウト
   */
  public logout(): void {
    if (this.state.isInitialized && this.state.isLoggedIn) {
      liff.logout();
      this.state.isLoggedIn = false;
      this.state.profile = {
        userId: null,
        displayName: null,
        pictureUrl: null,
      };
    }
  }

  /**
   * LIFFプロファイル情報を更新
   */
  private async updateProfile(): Promise<void> {
    try {
      if (!this.state.isInitialized || !this.state.isLoggedIn) {
        return;
      }

      const profile = await liff.getProfile();
      this.state.profile = {
        userId: profile.userId,
        displayName: profile.displayName,
        pictureUrl: profile.pictureUrl || null,
      };
    } catch (error) {
      clientLogger.info("Failed to get LIFF profile", createAuthLogContext(
        generateSessionId(),
        "liff",
        { 
          error: error instanceof Error ? error.message : String(error),
          component: "LiffService" 
        }
      ));
    }
  }

  /**
   * LIFFアクセストークンを取得
   * @returns LIFFアクセストークン
   */
  public getAccessToken(): string | null {
    if (!this.state.isInitialized || !this.state.isLoggedIn) {
      return null;
    }
    return liff.getAccessToken();
  }

  /**
   * LIFFトークンを使用してFirebase認証を行う
   * @returns 認証が成功したかどうか
   */
  public async signInWithLiffToken(): Promise<boolean> {
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      clientLogger.info("No LIFF access token available", createAuthLogContext(
        generateSessionId(),
        "liff",
        { component: "LiffService" }
      ));
      return false;
    }

    const operation = retry.operation({
      retries: 3,
      factor: 2,
      minTimeout: 1000,
      maxTimeout: 10000,
      randomize: true,
    });

    return new Promise((resolve) => {
      operation.attempt(async (currentAttempt) => {
        try {
          const attemptTimestamp = new Date().toISOString();
          clientLogger.debug(`LIFF Auth Attempt ${currentAttempt} - Starting`, {
            timestamp: attemptTimestamp,
            component: "LiffService"
          });
          clientLogger.debug("LIFF state before request", {
            isInitialized: this.state.isInitialized,
            isLoggedIn: this.state.isLoggedIn,
            accessToken: this.getAccessToken() ? "present" : "missing",
            userId: this.state.profile?.userId || "none",
            component: "LiffService"
          });

          const requestTimestamp = new Date().toISOString();
          clientLogger.debug("Making request to /line/liff-login", {
            timestamp: requestTimestamp,
            component: "LiffService"
          });

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_LIFF_LOGIN_ENDPOINT}/line/liff-login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ accessToken }),
            },
          );

          const responseTimestamp = new Date().toISOString();
          clientLogger.debug("/line/liff-login response", {
            timestamp: responseTimestamp,
            status: response.status,
            ok: response.ok,
            attempt: currentAttempt,
            statusText: response.statusText,
            component: "LiffService"
          });

          if (!response.ok) {
            throw new Error(`LIFF authentication failed: ${response.status}`);
          }

          const jsonTimestamp = new Date().toISOString();
          clientLogger.debug("Parsing response JSON", {
            timestamp: jsonTimestamp,
            component: "LiffService"
          });
          const { customToken, profile } = await response.json();
          clientLogger.debug("Received custom token and profile", {
            timestamp: jsonTimestamp,
            hasCustomToken: !!customToken,
            profileName: profile?.displayName || "none",
            component: "LiffService"
          });

          const firebaseTimestamp = new Date().toISOString();
          clientLogger.debug("Signing in with custom token to Firebase", {
            timestamp: firebaseTimestamp,
            component: "LiffService"
          });
          const userCredential = await signInWithCustomToken(lineAuth, customToken);
          clientLogger.debug("Firebase sign-in successful", {
            timestamp: firebaseTimestamp,
            uid: userCredential.user.uid,
            isNewUser:
              userCredential.user.metadata.creationTime ===
              userCredential.user.metadata.lastSignInTime,
            component: "LiffService"
          });

          await updateProfile(userCredential.user, {
            displayName: profile.displayName,
            photoURL: profile.pictureUrl,
          });

          const tokenTimestamp = new Date().toISOString();
          clientLogger.debug("Getting Firebase ID token", {
            timestamp: tokenTimestamp,
            component: "LiffService"
          });
          const idToken = await userCredential.user.getIdToken();
          const refreshToken = userCredential.user.refreshToken;
          const tokenResult = await userCredential.user.getIdTokenResult();
          const expirationTime = new Date(tokenResult.expirationTime).getTime();

          clientLogger.debug("Token details", {
            timestamp: tokenTimestamp,
            hasIdToken: !!idToken,
            hasRefreshToken: !!refreshToken,
            expirationTime: new Date(expirationTime).toISOString(),
            component: "LiffService"
          });

          const tokens: AuthTokens = {
            accessToken: idToken,
            refreshToken: refreshToken,
            expiresAt: expirationTime,
          };
          TokenManager.saveLineTokens(tokens);

          if (typeof window !== "undefined") {
            try {
              const AuthStateManager = require("./auth-state-manager").AuthStateManager;
              const authStateManager = AuthStateManager.getInstance();
              const timestamp = new Date().toISOString();
              clientLogger.debug("Updating LINE auth state in signInWithLiffToken", {
                timestamp,
                component: "LiffService"
              });
              await authStateManager.handleLineAuthStateChange(true);
              clientLogger.debug("AuthStateManager state updated to line_authenticated in signInWithLiffToken", {
                timestamp,
                component: "LiffService"
              });
            } catch (error) {
              clientLogger.error("Failed to update AuthStateManager state", {
                error: error instanceof Error ? error.message : String(error),
                component: "LiffService"
              });
            }
          }

          const completeTimestamp = new Date().toISOString();
          clientLogger.debug("LIFF authentication successful", {
            timestamp: completeTimestamp,
            component: "LiffService"
          });
          resolve(true);
        } catch (error) {
          const categorizedError = categorizeFirebaseError(error);

          clientLogger.info(`LIFF authentication error (attempt ${currentAttempt})`, createAuthLogContext(
            generateSessionId(),
            "liff",
            {
              type: categorizedError.type,
              message: categorizedError.message,
              error: error instanceof Error ? error.message : String(error),
              retryable: categorizedError.retryable,
              attempt: currentAttempt,
              component: "LiffService"
            }
          ));

          if (!categorizedError.retryable || !operation.retry(error as Error)) {
            clientLogger.info("LIFF authentication failed after all retries", createAuthLogContext(
              generateSessionId(),
              "liff",
              { component: "LiffService" }
            ));

            if (typeof window !== "undefined") {
              window.dispatchEvent(
                new CustomEvent("auth:error", {
                  detail: {
                    source: "liff",
                    errorType: categorizedError.type,
                    errorMessage: categorizedError.message,
                    originalError: error,
                  },
                }),
              );
            }

            resolve(false);
          }
        }
      });
    });
  }

  /**
   * 現在のLIFF状態を取得
   * @returns LIFF状態
   */
  public getState(): LiffState {
    return { ...this.state };
  }
}
