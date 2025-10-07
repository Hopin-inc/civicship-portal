"use client";

import liff from "@line/liff";
import { signInWithCustomToken, updateProfile } from "firebase/auth";
import { lineAuth } from "../core/firebase-config";
import { TokenManager } from "../core/token-manager";
import { logger } from "@/lib/logging";
import { RawURIComponent } from "@/utils/path";
import { useAuthStore } from "@/lib/auth/core/auth-store";
import { AuthStateManager } from "@/lib/auth/core/auth-state-manager";

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

  /**
   * LIFFでログイン
   * @param redirectPath リダイレクト先のパス（オプション）
   * @returns ログインが成功したかどうか
   */
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
    const addDebugLog = (message: string, extra?: Record<string, any>) => {
      const entry = {
        ts: new Date().toISOString(),
        message,
        ...extra,
      };
      console.log(`[LIFF DEBUG]`, entry);

      try {
        const existing = JSON.parse(localStorage.getItem("liff-debug") || "[]");
        existing.push(entry);
        localStorage.setItem("liff-debug", JSON.stringify(existing.slice(-100)));
      } catch {
        /* ignore JSON errors */
      }
    };

    const accessToken = this.getAccessToken();
    if (!accessToken) {
      addDebugLog("No LIFF access token available");
      return false;
    }

    const communityId = process.env.NEXT_PUBLIC_COMMUNITY_ID;
    const endpoint = `${process.env.NEXT_PUBLIC_LIFF_LOGIN_ENDPOINT}/line/liff-login`;
    const authStateManager = AuthStateManager.getInstance();

    addDebugLog("🚀 Start LIFF sign-in", { endpoint, communityId });

    // 最大3回まで（token切れ or transient errorのみリトライ）
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        addDebugLog(`Attempt ${attempt}: sending POST`, { endpoint });

        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Community-Id": communityId ?? "",
          },
          body: JSON.stringify({ accessToken }),
        });

        addDebugLog(`Response received`, { status: response.status });

        if (!response.ok) {
          if (response.status >= 500 || response.status === 401) {
            addDebugLog(`Server error: ${response.status}`);
            if (attempt < 3) continue;
          }
          throw new Error(`LIFF authentication failed: ${response.status}`);
        }

        const { customToken, profile } = await response.json();
        addDebugLog("✅ Custom token retrieved", { hasProfile: !!profile });

        const userCredential = await signInWithCustomToken(lineAuth, customToken);
        addDebugLog("🔥 Firebase signInWithCustomToken succeeded", {
          uid: userCredential.user.uid,
        });

        addDebugLog("⏳ Waiting for Firebase auth state sync...");
        await Promise.race([
          new Promise<void>((resolve) => {
            const unsub = lineAuth.onAuthStateChanged((u) => {
              if (u) {
                addDebugLog("✅ Firebase auth state changed (user detected)", { uid: u.uid });
                unsub();
                resolve();
              }
            });
          }),
          new Promise<void>((resolve) => {
            setTimeout(() => {
              addDebugLog("⚠️ Firebase auth sync timeout (5s)");
              resolve();
            }, 5000);
          }),
        ]);
        addDebugLog("🧩 Firebase currentUser is now available", {
          hasUser: !!lineAuth.currentUser,
        });

        await updateProfile(userCredential.user, {
          displayName: profile.displayName,
          photoURL: profile.pictureUrl,
        });
        addDebugLog("👤 Firebase profile updated", {
          displayName: profile.displayName,
        });

        const idToken = await userCredential.user.getIdToken();
        const refreshToken = userCredential.user.refreshToken;
        const tokenResult = await userCredential.user.getIdTokenResult();
        const expiresAt = new Date(tokenResult.expirationTime).getTime();

        addDebugLog("🎟 Firebase ID token retrieved", {
          idTokenLength: idToken?.length,
          expiresAt,
        });

        useAuthStore.getState().setState({
          lineTokens: {
            accessToken: idToken,
            refreshToken,
            expiresAt,
          },
        });
        addDebugLog("🧠 Zustand state updated");

        TokenManager.saveLineAuthFlag(true);
        addDebugLog("💾 LineAuthFlag saved");

        const isPhoneVerified = TokenManager.phoneVerified();
        if (isPhoneVerified) {
          TokenManager.savePhoneAuthFlag(true);
          addDebugLog("📱 PhoneAuthFlag saved");
        }

        addDebugLog("✅ LIFF sign-in succeeded fully");

        authStateManager.updateState("line_authenticated", "signInWithLiffToken");
        useAuthStore.getState().setState({
          isAuthenticating: false,
        });

        return true;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        addDebugLog(`⚠️ Attempt ${attempt} failed`, { message });

        if (message.includes("401") || message.includes("network") || message.includes("fetch")) {
          await new Promise((r) => setTimeout(r, attempt * 1000)); // 1s,2s,3s
          continue;
        }
        break;
      }
    }

    addDebugLog("❌ LIFF sign-in failed after all retries");
    return false;
  }

  /**
   * 現在のLIFF状態を取得
   * @returns LIFF状態
   */
  public getState(): LiffState {
    return { ...this.state };
  }
}
