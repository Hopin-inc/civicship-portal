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
    const bufferTime = 5 * 60 * 1000; // 5分前に更新

    if (!this.cachedToken || !this.cachedExpiry || this.cachedExpiry - now < bufferTime) {
      const idTokenResult = await user.getIdTokenResult();
      this.cachedToken = idTokenResult.token;
      this.cachedExpiry = new Date(idTokenResult.expirationTime).getTime();
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
}
