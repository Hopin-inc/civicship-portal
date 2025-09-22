"use client";

import liff from "@line/liff";
import { signInWithCustomToken, updateProfile } from "firebase/auth";
import { categorizeFirebaseError, lineAuth } from "./firebase-config";
import { AuthTokens, TokenManager } from "./token-manager";
import retry from "retry";
import { logger } from "@/lib/logging";
import { RawURIComponent } from "@/utils/path";

/**
 * LIFF初期化状態の型定義
 */
export type LiffInitState = "idle" | "pre-initializing" | "pre-initialized" | "initializing" | "initialized" | "failed";

export type LiffState = {
  state: LiffInitState;
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
  private static instance: LiffService | null = null;
  private liffId: string;
  private state: LiffInitState = "idle";
  private isLoggedIn = false;
  private profile = {
    userId: null as string | null,
    displayName: null as string | null,
    pictureUrl: null as string | null,
  };
  private error: Error | null = null;
  private preInitPromise: Promise<void> | null = null;
  private initPromise: Promise<void> | null = null;

  /**
   * コンストラクタ
   * @param liffId LIFF ID
   */
  private constructor(liffId: string) {
    this.liffId = liffId;
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
   * LIFF SDKの事前初期化（Root Layout用）
   * SDK初期化のみを行い、認証ロジックは含まない
   */
  public async preInitialize(): Promise<void> {
    if (this.state === "pre-initialized" || this.state === "initialized") {
      return;
    }
    if (this.preInitPromise) {
      return this.preInitPromise;
    }

    this.state = "pre-initializing";
    this.preInitPromise = (async () => {
      try {
        logger.debug("LiffService: Starting pre-initialization", {
          component: "LiffService",
          timestamp: new Date().toISOString(),
        });

        const { default: liff } = await import("@line/liff");
        await liff.init({ liffId: this.liffId });
        
        const anyLiff = liff as any;
        if (anyLiff?.ready?.then) {
          await anyLiff.ready;
        }

        this.isLoggedIn = liff.isLoggedIn();
        this.state = "pre-initialized";
        this.error = null;

        logger.debug("LiffService: Pre-initialization completed", {
          component: "LiffService",
          timestamp: new Date().toISOString(),
          isLoggedIn: this.isLoggedIn,
        });
      } catch (error) {
        this.state = "failed";
        this.error = error as Error;
        this.preInitPromise = null; // Allow retry
        
        const errorMessage = error instanceof Error ? error.message : String(error);
        const isEnvironmentConstraint = errorMessage.includes("LIFF") ||
                                       errorMessage.includes("LINE") ||
                                       errorMessage.includes("Load failed");
        
        if (isEnvironmentConstraint) {
          logger.warn("LiffService: Pre-initialization environment limitation", {
            authType: "liff",
            error: errorMessage,
            component: "LiffService",
            errorCategory: "environment_constraint",
            expected: true,
          });
        } else {
          logger.info("LiffService: Pre-initialization failed", {
            authType: "liff",
            error: errorMessage,
            component: "LiffService",
            errorCategory: "initialization_error",
          });
        }
        
        throw error;
      }
    })();

    return this.preInitPromise;
  }

  /**
   * LIFF認証初期化（AuthProvider用）
   * SDK初期化を確保してから認証ロジックを実行
   */
  public async initialize(): Promise<void> {
    if (this.state === "initialized") {
      return;
    }
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = (async () => {
      try {
        logger.debug("LiffService: Starting full initialization", {
          component: "LiffService",
          timestamp: new Date().toISOString(),
          currentState: this.state,
        });

        await this.preInitialize();
        
        this.state = "initializing";

        if (this.isLoggedIn) {
          await this.updateProfile();
        }

        this.state = "initialized";

        logger.debug("LiffService: Full initialization completed", {
          component: "LiffService",
          timestamp: new Date().toISOString(),
          isLoggedIn: this.isLoggedIn,
          hasProfile: !!this.profile.userId,
        });
      } catch (error) {
        this.state = "failed";
        this.error = error as Error;
        this.initPromise = null; // Allow retry
        
        logger.error("LiffService: Full initialization failed", {
          component: "LiffService",
          timestamp: new Date().toISOString(),
          error: error instanceof Error ? error.message : String(error),
        });
        
        throw error;
      }
    })();

    return this.initPromise;
  }

  /**
   * LIFFでログイン
   * @param redirectPath リダイレクト先のパス（オプション）
   * @returns ログインが成功したかどうか
   */
  public async login(redirectPath?: RawURIComponent): Promise<boolean> {
    try {
      if (this.state !== "initialized") {
        await this.initialize();
      }

      const { default: liff } = await import("@line/liff");

      if (liff.isInClient()) {
        this.isLoggedIn = true;
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
      const errorMessage = error instanceof Error ? error.message : String(error);
      const isEnvironmentConstraint = errorMessage.includes("LIFF") ||
                                     errorMessage.includes("LINE") ||
                                     errorMessage.includes("Load failed");
      
      if (isEnvironmentConstraint) {
        logger.warn("LIFF environment login limitation", {
          authType: "liff",
          error: errorMessage,
          component: "LiffService",
          errorCategory: "environment_constraint",
          expected: true,
        });
      } else {
        logger.info("LIFF login process failed", {
          authType: "liff",
          error: errorMessage,
          component: "LiffService",
          errorCategory: "auth_temporary",
        });
      }
      this.error = error as Error;
      return false;
    }
  }

  /**
   * LIFFからログアウト
   */
  public async logout(): Promise<void> {
    if ((this.state === "pre-initialized" || this.state === "initialized") && this.isLoggedIn) {
      const { default: liff } = await import("@line/liff");
      liff.logout();
      this.isLoggedIn = false;
      this.profile = {
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
      if ((this.state !== "pre-initialized" && this.state !== "initialized") || !this.isLoggedIn) {
        return;
      }

      const { default: liff } = await import("@line/liff");
      const profile = await liff.getProfile();
      this.profile = {
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
  public async getAccessToken(): Promise<string | null> {
    if ((this.state !== "pre-initialized" && this.state !== "initialized") || !this.isLoggedIn) {
      return null;
    }
    const { default: liff } = await import("@line/liff");
    return liff.getAccessToken();
  }

  /**
   * LIFFトークンを使用してFirebase認証を行う
   * @returns 認証が成功したかどうか
   */
  public async signInWithLiffToken(): Promise<boolean> {
    const accessToken = await this.getAccessToken();
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
          const communityId = process.env.NEXT_PUBLIC_COMMUNITY_ID;
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_LIFF_LOGIN_ENDPOINT}/line/liff-login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json", "X-Community-Id": communityId ?? "" },
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
              await authStateManager.handleLineAuthStateChange(true);
            } catch (error) {
              logger.warn("Failed to update AuthStateManager state", {
                error: error instanceof Error ? error.message : String(error),
                component: "LiffService",
                errorCategory: "state_management",
                retryable: true,
              });
            }
          }

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
    return {
      state: this.state,
      isLoggedIn: this.isLoggedIn,
      profile: { ...this.profile },
      error: this.error,
    };
  }

  /**
   * 初期化状態のみを取得
   * @returns 初期化状態
   */
  public getInitState(): LiffInitState {
    return this.state;
  }
}
