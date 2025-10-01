"use client";

import liff from "@line/liff";
import { signInWithCustomToken, updateProfile } from "firebase/auth";
import { categorizeFirebaseError, lineAuth } from "./firebase-config";
import { AuthTokens, TokenManager } from "./token-manager";
import retry from "retry";
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

export type InitOptions = { silent?: boolean };

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
  private initialized = false;
  private initPromise: Promise<boolean> | null = null;

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
   * LIFF SDKが利用可能かどうかを確認
   */
  public available(): boolean {
    return typeof window !== "undefined" && !!(window as any).liff;
  }

  /**
   * LIFF SDKの冪等初期化
   * @param opts 初期化オプション
   * @returns 初期化が成功したかどうか
   */
  public async ensureInitialized(opts: InitOptions = {}): Promise<boolean> {
    if (!this.available()) return false;
    if (this.initialized) return true;
    if (this.initPromise) return this.initPromise;

    const w = window as any;
    const liff = w.liff as any;

    this.initPromise = (async () => {
      try {
        await liff.init({ liffId: this.liffId });
        this.initialized = true;
        this.state = "initialized";
        this.isLoggedIn = liff.isLoggedIn();
        this.error = null;

        if (this.isLoggedIn) {
          await this.updateProfile();
        }

        return true;
      } catch (e) {
        if (!opts.silent) {
          console.warn("[LIFF] init failed", e);
        }
        this.initialized = false;
        this.state = "failed";
        this.error = e as Error;
        return false;
      } finally {
        this.initPromise = null;
      }
    })();

    return this.initPromise;
  }

  /**
   * LIFF認証初期化（AuthProvider用）
   * SDK初期化を確保してから認証ロジックを実行
   */
  public async initialize(): Promise<void> {
    const success = await this.ensureInitialized();
    if (!success) {
      throw new Error("LIFF initialization failed");
    }
  }

  /**
   * ログイン要求。未ログインのときだけ redirect する。
   * 戻り値で「redirectした/してない」を上位が把握できるようにする。
   */
  public async loginWithLiff(redirectUri: string): Promise<"redirect" | "ok" | "unavailable" | "init_failed"> {
    if (!this.available()) return "unavailable";
    const ok = await this.ensureInitialized({ silent: true });
    if (!ok) return "init_failed";

    const w = window as any;
    const liff = w.liff as any;

    if (!liff.isLoggedIn()) {
      liff.login({ redirectUri }); // ← ここでフロー終了（以降の処理はしない）
      return "redirect";
    }
    return "ok";
  }

  /**
   * LIFFでログイン（従来のインターフェース維持）
   * @param redirectPath リダイレクト先のパス（オプション）
   * @returns ログインが成功したかどうか
   */
  public async login(redirectPath?: RawURIComponent): Promise<boolean> {
    const redirectUri = typeof window !== "undefined"
      ? redirectPath
        ? window.location.origin + redirectPath
        : window.location.origin
      : "";

    const result = await this.loginWithLiff(redirectUri);
    return result === "ok";
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
            }
          }

          resolve(true);
        } catch (error) {
          const categorizedError = categorizeFirebaseError(error);

          if (!categorizedError.retryable || !operation.retry(error as Error)) {

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
