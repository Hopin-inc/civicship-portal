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
    logger.info("[LIFF DEBUG] getInstance called", {
      component: "LiffService",
      providedLiffId: liffId || "(empty)",
      hasExistingInstance: !!LiffService.instance,
      existingInstanceLiffId: LiffService.instance?.liffId || "(none)",
    });
    
    if (!LiffService.instance) {
      // Use empty string if liffId is not provided - initialization will fail gracefully
      // and the error will be captured in the state for proper handling
      LiffService.instance = new LiffService(liffId || "");
      if (!liffId) {
        // Set error state immediately if LIFF ID is missing
        LiffService.instance.state.error = new Error("LIFF ID is not configured");
        logger.warn("LiffService initialized without LIFF ID - LIFF features will be disabled", {
          component: "LiffService",
        });
      } else {
        logger.info("[LIFF DEBUG] LiffService instance created with liffId", {
          component: "LiffService",
          liffId,
        });
      }
    } else {
      // Fix race condition: if the singleton was created with an empty liffId
      // and a valid one is now provided, update the instance
      if (!LiffService.instance.liffId && liffId) {
        logger.info("[LIFF DEBUG] Updating existing instance with new liffId", {
          component: "LiffService",
          oldLiffId: LiffService.instance.liffId || "(empty)",
          newLiffId: liffId,
        });
        LiffService.instance.liffId = liffId;
        // Clear the error state since we now have a valid liffId
        LiffService.instance.state.error = null;
        // Reset initialization state so it can be re-initialized with the new liffId
        LiffService.instance.state.isInitialized = false;
        LiffService.instance.initializationPromise = null;
      }
    }
    return LiffService.instance;
  }

  public async initialize(): Promise<boolean> {
    logger.info("[LIFF DEBUG] initialize() called", {
      component: "LiffService",
      liffId: this.liffId || "(empty)",
      isAlreadyInitialized: this.state.isInitialized,
      hasInitializationPromise: !!this.initializationPromise,
    });
    
    if (this.state.isInitialized) {
      logger.info("[LIFF DEBUG] Already initialized, returning true", {
        component: "LiffService",
        isLoggedIn: this.state.isLoggedIn,
      });
      return true;
    }

    if (this.initializationPromise) {
      logger.info("[LIFF DEBUG] Initialization in progress, waiting for existing promise", {
        component: "LiffService",
      });
      return this.initializationPromise;
    }

    this.initializationPromise = (async () => {
      try {
        logger.info("[LIFF DEBUG] Calling liff.init()", {
          component: "LiffService",
          liffId: this.liffId,
          isInClient: typeof liff !== "undefined" ? liff.isInClient() : "liff not loaded",
        });
        
        await liff.init({ liffId: this.liffId });
        this.state.isInitialized = true;
        this.state.isLoggedIn = liff.isLoggedIn();

        logger.info("[LIFF DEBUG] liff.init() completed successfully", {
          component: "LiffService",
          isLoggedIn: this.state.isLoggedIn,
          isInClient: liff.isInClient(),
          os: liff.getOS(),
          language: liff.getLanguage(),
        });

        if (this.state.isLoggedIn) {
          await this.updateProfile();
          logger.info("[LIFF DEBUG] Profile updated after login", {
            component: "LiffService",
            userId: this.state.profile.userId,
            displayName: this.state.profile.displayName,
          });
        } else {
          logger.warn("[LIFF DEBUG] liff.isLoggedIn() returned false after init", {
            component: "LiffService",
            isInClient: liff.isInClient(),
          });
        }

        return true;
      } catch (error) {
        logger.error("[LIFF DEBUG] liff.init() failed with error", {
          component: "LiffService",
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
      const infoMessage = operation === "login" ? "LIFF login process failed" : "LIFF initialization failed";
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

  public getAccessToken(): string | null {
    if (!this.state.isInitialized || !this.state.isLoggedIn) {
      return null;
    }
    return liff.getAccessToken();
  }

  public async signInWithLiffToken(): Promise<boolean> {
    logger.info("[LIFF DEBUG] signInWithLiffToken() called", {
      component: "LiffService",
      isInitialized: this.state.isInitialized,
      isLoggedIn: this.state.isLoggedIn,
    });
    
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      logger.warn("[LIFF DEBUG] signInWithLiffToken() - no access token available", {
        component: "LiffService",
        isInitialized: this.state.isInitialized,
        isLoggedIn: this.state.isLoggedIn,
      });
      return false;
    }

    logger.info("[LIFF DEBUG] signInWithLiffToken() - access token obtained", {
      component: "LiffService",
      accessTokenLength: accessToken.length,
    });

    // For LINE authentication, we always use the 'integrated' configuration
    // regardless of which community the user is currently in.
    const configId = "integrated";
    const endpoint = `${process.env.NEXT_PUBLIC_LIFF_LOGIN_ENDPOINT}/line/liff-login`;
    const authStateManager = AuthStateManager.getInstance();

    logger.info("[LIFF DEBUG] signInWithLiffToken() - calling backend", {
      component: "LiffService",
      endpoint,
      configId,
    });

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
          logger.error("[LIFF DEBUG] signInWithLiffToken() - backend returned error", {
            component: "LiffService",
            status: response.status,
            errorText,
            attempt,
          });
          if (response.status >= 500 || response.status === 401) {
            if (attempt < 3) continue;
          }
          throw new Error(`LIFF authentication failed: ${response.status} - ${errorText}`);
        }

        logger.info("[LIFF DEBUG] signInWithLiffToken() - backend returned success", {
          component: "LiffService",
          attempt,
        });

        const responseData = await response.json();
        const { customToken, profile } = responseData;
        
        logger.info("[LIFF DEBUG] signInWithLiffToken() - signing in with custom token", {
          component: "LiffService",
          hasCustomToken: !!customToken,
          profileDisplayName: profile?.displayName,
        });
        
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

        if (processedError.message.includes("401") || processedError.message.includes("network") || processedError.message.includes("fetch")) {
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
