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
      if (!liffId) {
        throw new Error("LIFF ID is required for the first initialization");
      }
      LiffService.instance = new LiffService(liffId);
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
        await liff.init({ liffId: this.liffId });
        this.state.isInitialized = true;
        this.state.isLoggedIn = liff.isLoggedIn();

        if (this.state.isLoggedIn) {
          await this.updateProfile();
        }

        return true;
      } catch (error) {
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
      logger.info(infoMessage, {
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
      logger.info("Failed to get LIFF profile", {
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
    const accessToken = this.getAccessToken();
    if (!accessToken) return false;

    const communityId = process.env.NEXT_PUBLIC_COMMUNITY_ID;
    const endpoint = `${process.env.NEXT_PUBLIC_LIFF_LOGIN_ENDPOINT}/line/liff-login`;
    const authStateManager = AuthStateManager.getInstance();

    // 最大3回まで（token切れ or transient errorのみリトライ）
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Community-Id": communityId ?? "",
          },
          body: JSON.stringify({ accessToken }),
        });

        if (!response.ok) {
          if (response.status >= 500 || response.status === 401) {
            if (attempt < 3) continue;
          }
          throw new Error(`LIFF authentication failed: ${response.status}`);
        }

        const { customToken, profile } = await response.json();
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
