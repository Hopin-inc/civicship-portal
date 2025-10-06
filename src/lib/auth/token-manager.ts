"use client";

import { logger } from "@/lib/logging";
import { lineAuth } from "@/lib/auth/firebase-config";
import { User } from "@firebase/auth";

/**
 * 認証トークン情報の型定義
 */
export interface AuthTokens {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
}

export interface PhoneAuthTokens {
  phoneUid: string | null;
  phoneNumber: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
}

export class TokenManager {
  private static cachedToken: string | null = null;
  private static cachedExpiry: number | null = null;

  private static readonly LINE_AUTHENTICATED_KEY = "line_authenticated";
  private static readonly PHONE_AUTHENTICATED_KEY = "phone_authenticated";
  private static readonly PHONE_ACCESS_TOKEN_KEY = "phone_auth_token";

  /**
   * LINE認証済みフラグを保存
   * @param isAuthenticated 認証済みかどうか
   */
  static saveLineAuthFlag(isAuthenticated: boolean): void {
    this.setCookie(this.LINE_AUTHENTICATED_KEY, isAuthenticated.toString());
  }

  /**
   * Phone認証済みフラグを保存
   * @param isAuthenticated 認証済みかどうか
   */
  static savePhoneAuthFlag(isAuthenticated: boolean): void {
    this.setCookie(this.PHONE_AUTHENTICATED_KEY, isAuthenticated.toString());
  }

  /**
   * LINE認証済みフラグを取得
   * @returns 認証済みかどうか
   */
  static getLineAuthFlag(): boolean {
    return this.getCookie(this.LINE_AUTHENTICATED_KEY) === "true";
  }

  /**
   * Phone認証済みフラグを取得
   * @returns 認証済みかどうか
   */
  static getPhoneAuthFlag(): boolean {
    return this.getCookie(this.PHONE_AUTHENTICATED_KEY) === "true";
  }

  static phoneVerified(): boolean {
    const accessToken = this.getCookie(this.PHONE_ACCESS_TOKEN_KEY);
    return accessToken !== null;
  }

  /**
   * LINE認証済みフラグをクリア
   */
  static clearLineAuthFlag(): void {
    this.deleteCookie(this.LINE_AUTHENTICATED_KEY);
  }

  /**
   * Phone認証済みフラグをクリア
   */
  static clearPhoneAuthFlag(): void {
    this.deleteCookie(this.PHONE_AUTHENTICATED_KEY);
  }

  /**
   * すべての認証フラグをクリア
   */
  static clearAllAuthFlags(): void {
    this.clearLineAuthFlag();
    this.clearPhoneAuthFlag();
  }

  static async getCachedToken(user: User | null): Promise<string | null> {
    if (!user) return null;

    const now = Date.now();
    const bufferTime = 5 * 60 * 1000; // 有効期限5分前に更新

    // キャッシュが存在しない or 有効期限が近い → 更新処理
    if (!this.cachedToken || !this.cachedExpiry || this.cachedExpiry - now < bufferTime) {
      try {
        // 一度キャッシュの有効期限を確認
        const idTokenResult = await user.getIdTokenResult();
        const expiry = new Date(idTokenResult.expirationTime).getTime();

        if (expiry - now < bufferTime) {
          // 🔁 有効期限が近い or 既に切れている → 強制更新
          const freshToken = await user.getIdToken(true);
          const freshResult = await user.getIdTokenResult();
          this.cachedToken = freshToken;
          this.cachedExpiry = new Date(freshResult.expirationTime).getTime();
          return this.cachedToken;
        }

        // ✅ まだ有効ならキャッシュ更新
        this.cachedToken = idTokenResult.token;
        this.cachedExpiry = expiry;
      } catch (err) {
        console.warn("⚠️ Failed to refresh Firebase token", err);
        this.cachedToken = null;
        this.cachedExpiry = null;
      }
    }

    return this.cachedToken;
  }

  /**
   * LINE認証トークンが有効期限切れかどうかを確認
   * @returns 有効期限切れの場合はtrue
   */
  static async isLineTokenExpired(): Promise<boolean> {
    try {
      const { lineAuth } = await import("./firebase-config");

      if (!lineAuth.currentUser) {
        return true; // No current user means not authenticated
      }

      await lineAuth.currentUser.getIdToken();
      return false; // Successfully got token, so it's valid
    } catch (error) {
      logger.info("LINE token validation failed", {
        error: error instanceof Error ? error.message : String(error),
        component: "TokenManager",
      });
      return true; // Any error means the token/session is invalid
    }
  }

  static isTokenExpiredSync(tokens: AuthTokens): boolean {
    if (!tokens.expiresAt) return true;
    const now = Date.now();
    const bufferTime = 5 * 60 * 1000;
    return tokens.expiresAt - now < bufferTime;
  }

  /**
   * Cookieを設定
   * @param name Cookieの名前
   * @param value Cookieの値
   * @param days Cookieの有効期限（日数）
   */
  private static setCookie(name: string, value: string, days = 30): void {
    if (typeof document === "undefined") return;

    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  }

  /**
   * Cookieを取得
   * @param name Cookieの名前
   * @returns Cookieの値（存在しない場合はnull）
   */
  private static getCookie(name: string): string | null {
    if (typeof document === "undefined") return null;

    const cookies = document.cookie.split("; ");
    const cookie = cookies.find((c) => c.startsWith(`${name}=`));
    const [_, ...cookieValues] = cookie?.split("=") ?? [];
    return cookieValues?.length ? cookieValues.join("=") : null;
  }

  /**
   * Cookieを削除
   * @param name 削除するCookieの名前
   */
  private static deleteCookie(name: string): void {
    if (typeof document === "undefined") return;

    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax`;
  }

  static clearDeprecatedCookies(): void {
    this.deleteCookie("phone_uid");
    this.deleteCookie("phone_number");
    this.deleteCookie("phone_auth_token");
    this.deleteCookie("phone_refresh_token");
    this.deleteCookie("phone_token_expires_at");
    this.deleteCookie("access_token");
    this.deleteCookie("refresh_token");
    this.deleteCookie("token_expires_at");
  }
}
