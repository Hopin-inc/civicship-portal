"use client";

import liff from "@line/liff";
import { signInWithCustomToken, updateProfile } from "firebase/auth";
import { categorizeFirebaseError, lineAuth } from "./firebase-config";
import { AuthTokens, TokenManager } from "./token-manager";
import retry from "retry";
import { logger } from "@/lib/logging";
import { RawURIComponent } from "@/utils/path";

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
  private initializing = false;

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

  public static isLiffEnvironment(): boolean {
    return liff.isInClient();
  }

  public static getInstance(liffId?: string): LiffService {
    if (!LiffService.instance) {
      if (!liffId) {
        throw new Error("LIFF ID is required for the first initialization");
      }
      LiffService.instance = new LiffService(liffId);
    }
    return LiffService.instance;
  }

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
      const errorMessage = error instanceof Error ? error.message : String(error);
      const isEnvironmentConstraint =
        errorMessage.includes("LIFF") ||
        errorMessage.includes("LINE") ||
        errorMessage.includes("Load failed");

      if (isEnvironmentConstraint) {
        logger.warn("LIFF environment initialization limitation", {
          authType: "liff",
          error: errorMessage,
          component: "LiffService",
          errorCategory: "environment_constraint",
          expected: true,
        });
      } else {
        logger.info("LIFF initialization failed", {
          authType: "liff",
          error: errorMessage,
          component: "LiffService",
          errorCategory: "initialization_error",
        });
      }
      this.state.error = error as Error;
      return false;
    } finally {
      this.initializing = false;
    }
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
      const errorMessage = error instanceof Error ? error.message : String(error);
      const isEnvironmentConstraint =
        errorMessage.includes("LIFF") ||
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
      this.state.error = error as Error;
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

  public getAccessToken(): string | null {
    if (!this.state.isInitialized || !this.state.isLoggedIn) {
      return null;
    }
    return liff.getAccessToken();
  }

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

  public getState(): LiffState {
    return { ...this.state };
  }
}
