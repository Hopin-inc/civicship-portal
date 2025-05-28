"use client";

import liff from "@line/liff";
import { signInWithCustomToken, updateProfile } from "firebase/auth";
import { lineAuth, categorizeFirebaseError } from "./firebase-config";
import { TokenManager, AuthTokens } from "./token-manager";
import retry from "retry";
import logger from "../logging";

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

      await liff.init({ liffId: this.liffId });
      this.state.isInitialized = true;
      this.state.isLoggedIn = liff.isLoggedIn();

      if (this.state.isLoggedIn) {
        await this.updateProfile();
      }

      return true;
    } catch (error) {
      logger.error("LIFF initialization error", {
        error: error instanceof Error ? error.message : String(error),
        liffId: this.liffId
      });
      this.state.error = error as Error;
      return false;
    }
  }

  /**
   * LIFFでログイン
   * @returns ログインが成功したかどうか
   */
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

      if (!this.state.isLoggedIn) {
        if (liff.isInClient()) {
          this.state.isLoggedIn = true;
        } else {
          const redirectUri = redirectPath && typeof window !== "undefined"
            ? window.location.origin + redirectPath
            : typeof window !== "undefined" ? window.location.pathname : undefined;

          liff.login({ redirectUri });
          return false; // リダイレクトするのでここには到達しない
        }
      }

      await this.updateProfile();
      return true;
    } catch (error) {
      logger.error("LIFF login error", {
        error: error instanceof Error ? error.message : String(error),
        isInitialized: this.state.isInitialized
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
      logger.error("Failed to get LIFF profile", {
        error: error instanceof Error ? error.message : String(error),
        isLoggedIn: this.state.isLoggedIn
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
      logger.error("No LIFF access token available", {
        isInitialized: this.state.isInitialized,
        isLoggedIn: this.state.isLoggedIn
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
          logger.debug("LIFF Auth Attempt Starting", {
            attempt: currentAttempt,
            timestamp: attemptTimestamp,
            isInitialized: this.state.isInitialized,
            isLoggedIn: this.state.isLoggedIn,
            accessToken: this.getAccessToken() ? "present" : "missing",
            userId: this.state.profile?.userId || "none"
          });

          const requestTimestamp = new Date().toISOString();
          logger.debug("Making request to /line/liff-login", {
            timestamp: requestTimestamp
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
          logger.debug("/line/liff-login response received", {
            timestamp: responseTimestamp,
            status: response.status,
            ok: response.ok,
            attempt: currentAttempt,
            statusText: response.statusText
          });

          if (!response.ok) {
            throw new Error(`LIFF authentication failed: ${response.status}`);
          }

          const jsonTimestamp = new Date().toISOString();
          logger.debug("Parsing response JSON", {
            timestamp: jsonTimestamp
          });
          const { customToken, profile } = await response.json();
          logger.debug("Received custom token and profile", {
            timestamp: jsonTimestamp,
            hasCustomToken: !!customToken,
            profileName: profile?.displayName || "none"
          });

          const firebaseTimestamp = new Date().toISOString();
          logger.debug("Signing in with custom token to Firebase", {
            timestamp: firebaseTimestamp
          });
          const userCredential = await signInWithCustomToken(lineAuth, customToken);
          logger.debug("Firebase sign-in successful", {
            timestamp: firebaseTimestamp,
            uid: userCredential.user.uid,
            isNewUser: userCredential.user.metadata.creationTime === userCredential.user.metadata.lastSignInTime
          });
          
          await updateProfile(userCredential.user, {
            displayName: profile.displayName,
            photoURL: profile.pictureUrl,
          });

          const tokenTimestamp = new Date().toISOString();
          logger.debug("Getting Firebase ID token", {
            timestamp: tokenTimestamp
          });
          const idToken = await userCredential.user.getIdToken();
          const refreshToken = userCredential.user.refreshToken;
          const tokenResult = await userCredential.user.getIdTokenResult();
          const expirationTime = new Date(tokenResult.expirationTime).getTime();

          logger.debug("Token details", {
            timestamp: tokenTimestamp,
            hasIdToken: !!idToken,
            hasRefreshToken: !!refreshToken,
            expirationTime: new Date(expirationTime).toISOString()
          });

          const tokens: AuthTokens = {
            accessToken: idToken,
            refreshToken: refreshToken,
            expiresAt: expirationTime,
          };
          TokenManager.saveLineTokens(tokens);

          const completeTimestamp = new Date().toISOString();
          logger.info("LIFF authentication successful", {
            timestamp: completeTimestamp,
            userId: userCredential.user.uid
          });
          resolve(true);
        } catch (error) {
          const categorizedError = categorizeFirebaseError(error);

          const logLevel = categorizedError.retryable ? "info" : "error";
          logger[logLevel]("LIFF authentication error", {
            attempt: currentAttempt,
            errorType: categorizedError.type,
            message: categorizedError.message,
            retryable: categorizedError.retryable,
            operation: "signInWithLiffToken"
          });
          

          if (!categorizedError.retryable || !operation.retry(error as Error)) {
            logger.error("LIFF authentication failed after all retries", {
              errorType: categorizedError.type,
              message: categorizedError.message
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
