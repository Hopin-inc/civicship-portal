"use client";

import liff from "@line/liff";
import { signInWithCustomToken, updateProfile } from "firebase/auth";
import { lineAuth } from "../core/firebase-config";
import { TokenManager } from "../core/token-manager";
import { logger } from "@/lib/logging";
import { RawURIComponent } from "@/utils/path";
import { useAuthStore } from "@/lib/auth/core/auth-store";
import { AuthStateManager } from "@/lib/auth/core/auth-state-manager";

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

export class LiffService {
  private static instance: LiffService;
  private liffId: string;
  private state: LiffState;
  private initializationPromise: Promise<boolean> | null = null;

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

  public static getInstance(liffId?: string): LiffService {
    if (!LiffService.instance) {
      LiffService.instance = new LiffService(liffId || "");
    } else if (!LiffService.instance.liffId && liffId) {
      LiffService.instance.liffId = liffId;
      LiffService.instance.state.error = null;
      LiffService.instance.state.isInitialized = false;
      LiffService.instance.initializationPromise = null;
    }
    return LiffService.instance;
  }

  public async initialize(): Promise<boolean> {
    if (this.state.isInitialized) {
      return true;
    }

    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = (async () => {
      try {
        // Check if we're running inside a LIFF mini-app (SDK is pre-initialized by LINE)
        // In this case, liff.isInClient() returns true even before liff.init() is called
        const isInLiffClient = liff.isInClient();

        if (isInLiffClient) {
          // When running inside LINE mini-app, the SDK is already initialized by LINE
          // We need to call liff.init() but it may fail if the liffId doesn't match
          // the one used to launch the mini-app. In this case, we should still
          // consider the SDK as initialized since LINE has already done it.
          try {
            if (this.liffId) {
              await liff.init({ liffId: this.liffId });
            }
          } catch (initError) {
            // If init fails in LIFF client, the SDK is still usable because
            // LINE has already initialized it. Log the error but continue.
            logger.warn("LIFF init in mini-app environment failed, using pre-initialized SDK", {
              error: initError instanceof Error ? initError.message : String(initError),
              liffId: this.liffId,
              isInClient: true,
            });
          }
          // SDK is usable regardless of init result when in LIFF client
          this.state.isInitialized = true;
          this.state.isLoggedIn = liff.isLoggedIn();
        } else {
          // Normal browser environment - must initialize with liffId
          if (!this.liffId) {
            throw new Error("LIFF ID is not configured");
          }
          await liff.init({ liffId: this.liffId });
          this.state.isInitialized = true;
          this.state.isLoggedIn = liff.isLoggedIn();
        }

        if (this.state.isLoggedIn) {
          await this.updateProfile();
        }

        return true;
      } catch (error) {
        logger.error("LIFF initialization failed", {
          error: error instanceof Error ? error.message : String(error),
          liffId: this.liffId,
        });
        this._handleLiffError(error, "initialize");
        return false;
      } finally {
        this.initializationPromise = null;
      }
    })();

    return this.initializationPromise;
  }

  public async login(redirectPath?: RawURIComponent): Promise<boolean> {
    try {
      if (!this.state.isInitialized) {
        await this.initialize();
      }

      if (liff.isInClient()) {
        this.state.isLoggedIn = true;
      } else {
        const redirectUri =
          typeof window !== "undefined"
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
      this._handleLiffError(error, "login");
      return false;
    }
  }

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

  private _handleLiffError(error: unknown, operation: "initialize" | "login"): void {
    const processedError = error instanceof Error ? error : new Error(String(error));
    const isEnvironmentConstraint =
      processedError.message.includes("LIFF") ||
      processedError.message.includes("LINE") ||
      processedError.message.includes("Load failed");

    const logContext = {
      authType: "liff",
      error: processedError.message,
      component: "LiffService",
    };

    if (isEnvironmentConstraint) {
      const warnMessage = `LIFF environment ${operation} limitation`;
      logger.warn(warnMessage, {
        ...logContext,
        errorCategory: "environment_constraint",
        expected: true,
      });
    } else {
      const infoMessage =
        operation === "login" ? "LIFF login process failed" : "LIFF initialization failed";
      const errorCategory = operation === "login" ? "auth_temporary" : "initialization_error";
      logger.warn(infoMessage, {
        ...logContext,
        errorCategory,
      });
    }
    this.state.error = processedError;
  }

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
      const processedError = error instanceof Error ? error : new Error(String(error));
      logger.warn("Failed to get LIFF profile", {
        authType: "liff",
        error: processedError.message,
        component: "LiffService",
      });
    }
  }

  /**
   * Mini App用: profileスコープの権限を確保する
   * チャネル同意の簡略化により、デフォルトではopenidのみ。
   * バックエンドでgetProfileを呼ぶ前に、この権限を取得する必要がある。
   * @see https://developers.line.biz/ja/news/2025/10/31/channel-consent-simplification/
   */
  private async ensureProfilePermission(): Promise<void> {
    if (typeof window === "undefined") return;
    if (!liff.isInClient()) return;
    if (!liff.isApiAvailable("permission")) return;

    try {
      const permissionStatus = await liff.permission.query("profile");

      logger.info("LIFF profile permission status", {
        authType: "liff",
        component: "LiffService",
        state: permissionStatus.state,
      });

      if (permissionStatus.state === "prompt") {
        await liff.permission.requestAll();
      }
    } catch (error) {
      const processedError = error instanceof Error ? error : new Error(String(error));
      logger.info("LIFF profile permission check failed", {
        authType: "liff",
        component: "LiffService",
        error: processedError.message,
      });
    }
  }

  public getAccessToken(): string | null {
    if (!this.state.isInitialized || !this.state.isLoggedIn) {
      return null;
    }
    return liff.getAccessToken();
  }

  public async signInWithLiffToken(): Promise<boolean> {
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      return false;
    }

    await this.ensureProfilePermission();

    // For LINE authentication, we always use the 'integrated' configuration
    // regardless of which community the user is currently in.
    const configId = "integrated";
    const endpoint = `${process.env.NEXT_PUBLIC_LIFF_LOGIN_ENDPOINT}/line/liff-login`;
    const authStateManager = AuthStateManager.getInstance();

    // 最大3回まで（token切れ or transient errorのみリトライ）
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Community-Id": configId,
          },
          body: JSON.stringify({ accessToken }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          if (response.status >= 500 || response.status === 401) {
            if (attempt < 3) continue;
          }
          throw new Error(`LIFF authentication failed: ${response.status} - ${errorText}`);
        }

        const responseData = await response.json();
        const { customToken, profile } = responseData;

        const userCredential = await signInWithCustomToken(lineAuth, customToken);

        await Promise.race([
          new Promise<void>((resolve) => {
            const unsub = lineAuth.onAuthStateChanged((u) => {
              if (u) {
                unsub();
                resolve();
              }
            });
          }),
          new Promise<void>((resolve) => {
            setTimeout(() => {
              resolve();
            }, 5000);
          }),
        ]);

        await updateProfile(userCredential.user, {
          displayName: profile.displayName,
          photoURL: profile.pictureUrl,
        });

        const idToken = await userCredential.user.getIdToken();
        const refreshToken = userCredential.user.refreshToken;
        const tokenResult = await userCredential.user.getIdTokenResult();
        const expiresAt = String(new Date(tokenResult.expirationTime).getTime());

        useAuthStore.getState().setState({
          lineTokens: {
            accessToken: idToken,
            refreshToken,
            expiresAt,
          },
        });

        TokenManager.saveLineAuthFlag(true);

        const isPhoneVerified = TokenManager.phoneVerified();
        if (isPhoneVerified) {
          TokenManager.savePhoneAuthFlag(true);
        }

        authStateManager.updateState("line_authenticated", "signInWithLiffToken");
        useAuthStore.getState().setState({
          isAuthenticating: false,
        });

        return true;
      } catch (error) {
        const processedError = error instanceof Error ? error : new Error(String(error));

        if (
          processedError.message.includes("401") ||
          processedError.message.includes("network") ||
          processedError.message.includes("fetch")
        ) {
          await new Promise((r) => setTimeout(r, attempt * 1000)); // 1s,2s,3s
          continue;
        }
        break;
      }
    }

    return false;
  }

  public getState(): LiffState {
    return { ...this.state };
  }
}
