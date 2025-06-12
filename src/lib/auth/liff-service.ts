"use client";

import liff from "@line/liff";
import { signInWithCustomToken, updateProfile } from "firebase/auth";
import { categorizeFirebaseError, lineAuth } from "./firebase-config";
import { AuthTokens, TokenManager } from "./token-manager";
import retry from "retry";

import { AuthEnvironment } from "@/lib/auth/environment-detector";
import { logger } from "@/lib/logging";

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
    try {
      if (this.state.isInitialized) {
        return true;
      }
      if (this.initializing) {
        return true;
      }
      this.initializing = true;

      await liff.init({ liffId: this.liffId });
      this.state.isInitialized = true;
      this.state.isLoggedIn = liff.isLoggedIn();

      if (this.state.isLoggedIn) {
        await this.updateProfile();
      }

      return true;
    } catch (error) {
      logger.info("LIFF initialization error", {
        authType: "liff",
        error,
        component: "LiffService",
      });
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
        const redirectUri = typeof window !== "undefined"
          ? redirectPath 
            ? window.location.origin + redirectPath
            : window.location.origin
          : undefined;

        liff.login({ redirectUri });
        return false; // リダイレクトするのでここには到達しない
      }

      await this.updateProfile();
      return true;
    } catch (error) {
      logger.info("LIFF login error", {
        authType: "liff",
        error: error instanceof Error ? error.message : String(error),
        component: "LiffService",
      });
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
      logger.info("Failed to get LIFF profile", {
        authType: "liff",
        error: error instanceof Error ? error.message : String(error),
        component: "LiffService",
      });
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
      logger.info("No LIFF access token available", {
        authType: "liff",
        component: "LiffService",
      });
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

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_LIFF_LOGIN_ENDPOINT}/line/liff-login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ accessToken }),
            },
          );

          if (!response.ok) {
            throw new Error(`LIFF authentication failed: ${response.status}`);
          }
          const { customToken, profile } = await response.json();

          const userCredential = await signInWithCustomToken(lineAuth, customToken);

          await updateProfile(userCredential.user, {
            displayName: profile.displayName,
            photoURL: profile.pictureUrl,
          });

          const idToken = await userCredential.user.getIdToken();
          const refreshToken = userCredential.user.refreshToken;
          const tokenResult = await userCredential.user.getIdTokenResult();
          const expirationTime = new Date(tokenResult.expirationTime).getTime();

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
              logger.debug("Updating LINE auth state in signInWithLiffToken", {
                timestamp,
                component: "LiffService",
              });
              await authStateManager.handleLineAuthStateChange(true);
              logger.debug(
                "AuthStateManager state updated to line_authenticated in signInWithLiffToken",
                {
                  timestamp,
                  component: "LiffService",
                },
              );
            } catch (error) {
              logger.error("Failed to update AuthStateManager state", {
                error: error instanceof Error ? error.message : String(error),
                component: "LiffService",
              });
            }
          }

          const completeTimestamp = new Date().toISOString();
          logger.debug("LIFF authentication successful", {
            timestamp: completeTimestamp,
            component: "LiffService",
          });
          resolve(true);
        } catch (error) {
          const categorizedError = categorizeFirebaseError(error);

          logger.info(`LIFF authentication error (attempt ${currentAttempt})`, {
            authType: "liff",
            type: categorizedError.type,
            message: categorizedError.message,
            error: error instanceof Error ? error.message : String(error),
            retryable: categorizedError.retryable,
            attempt: currentAttempt,
            component: "LiffService",
          });

          if (!categorizedError.retryable || !operation.retry(error as Error)) {
            logger.info("LIFF authentication failed after all retries", {
              authType: "liff",
              component: "LiffService",
            });

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
