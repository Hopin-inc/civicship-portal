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

  private static readonly LINE_ACCESS_TOKEN_KEY = "access_token";
  private static readonly LINE_REFRESH_TOKEN_KEY = "refresh_token";
  private static readonly LINE_TOKEN_EXPIRES_AT_KEY = "token_expires_at";

  private static readonly PHONE_UID_KEY = "phone_uid";
  private static readonly PHONE_NUMBER_KEY = "phone_number";
  private static readonly PHONE_ACCESS_TOKEN_KEY = "phone_auth_token";
  private static readonly PHONE_REFRESH_TOKEN_KEY = "phone_refresh_token";
  private static readonly PHONE_TOKEN_EXPIRES_AT_KEY = "phone_token_expires_at";

  /**
   * LINE認証トークンをCookieに保存
   * @param tokens 保存するトークン情報
   */
  static saveLineTokens(tokens: AuthTokens): void {
    if (tokens.accessToken) {
      this.setCookie(this.LINE_ACCESS_TOKEN_KEY, tokens.accessToken);
    }
    if (tokens.refreshToken) {
      this.setCookie(this.LINE_REFRESH_TOKEN_KEY, tokens.refreshToken);
    }
    if (tokens.expiresAt) {
      this.setCookie(this.LINE_TOKEN_EXPIRES_AT_KEY, tokens.expiresAt.toString());
    }
  }

  /**
   * 電話番号認証トークンをCookieに保存
   * @param tokens 保存するトークン情報
   */
  static savePhoneTokens(tokens: PhoneAuthTokens): void {
    if (tokens.phoneUid) {
      this.setCookie(this.PHONE_UID_KEY, tokens.phoneUid);
    }
    if (tokens.phoneNumber) {
      this.setCookie(this.PHONE_NUMBER_KEY, tokens.phoneNumber);
    }
    if (tokens.accessToken) {
      this.setCookie(this.PHONE_ACCESS_TOKEN_KEY, tokens.accessToken);
    }
    if (tokens.refreshToken) {
      this.setCookie(this.PHONE_REFRESH_TOKEN_KEY, tokens.refreshToken);
    }
    if (tokens.expiresAt) {
      this.setCookie(this.PHONE_TOKEN_EXPIRES_AT_KEY, tokens.expiresAt.toString());
    }
  }

  /**
   * LINE認証トークンをCookieから取得
   * @returns 取得したトークン情報
   */
  static getLineTokens(): AuthTokens {
    const accessToken = this.getCookie(this.LINE_ACCESS_TOKEN_KEY);
    const refreshToken = this.getCookie(this.LINE_REFRESH_TOKEN_KEY);
    const expiresAtStr = this.getCookie(this.LINE_TOKEN_EXPIRES_AT_KEY);

    return {
      accessToken,
      refreshToken,
      expiresAt: expiresAtStr ? parseInt(expiresAtStr, 10) : null,
    };
  }

  /**
   * 電話番号認証トークンをCookieから取得
   * @returns 取得したトークン情報
   */
  static getPhoneTokens(): PhoneAuthTokens {
    const phoneUid = this.getCookie(this.PHONE_UID_KEY);
    const phoneNumber = this.getCookie(this.PHONE_NUMBER_KEY);
    const accessToken = this.getCookie(this.PHONE_ACCESS_TOKEN_KEY);
    const refreshToken = this.getCookie(this.PHONE_REFRESH_TOKEN_KEY);
    const expiresAtStr = this.getCookie(this.PHONE_TOKEN_EXPIRES_AT_KEY);

    return {
      accessToken,
      refreshToken,
      phoneUid,
      phoneNumber,
      expiresAt: expiresAtStr ? parseInt(expiresAtStr, 10) : null,
    };
  }

  /**
   * LINE認証トークンをCookieから削除
   */
  static clearLineTokens(): void {
    this.deleteCookie(this.LINE_ACCESS_TOKEN_KEY);
    this.deleteCookie(this.LINE_REFRESH_TOKEN_KEY);
    this.deleteCookie(this.LINE_TOKEN_EXPIRES_AT_KEY);
  }

  /**
   * 電話番号認証トークンをCookieから削除
   */
  static clearPhoneTokens(): void {
    this.deleteCookie(this.PHONE_UID_KEY);
    this.deleteCookie(this.PHONE_NUMBER_KEY);
    this.deleteCookie(this.PHONE_ACCESS_TOKEN_KEY);
    this.deleteCookie(this.PHONE_REFRESH_TOKEN_KEY);
    this.deleteCookie(this.PHONE_TOKEN_EXPIRES_AT_KEY);
  }

  /**
   * すべての認証トークンをCookieから削除
   */
  static clearAllTokens(): void {
    this.clearLineTokens();
    this.clearPhoneTokens();
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
   * 電話番号認証トークンが有効期限切れかどうかを確認
   * @returns 有効期限切れの場合はtrue
   */
  static async isPhoneTokenExpired(): Promise<boolean> {
    const { expiresAt } = this.getPhoneTokens();
    if (!expiresAt) return true;

    const now = Date.now();
    const bufferTime = 5 * 60 * 1000; // 5分（ミリ秒）
    return expiresAt - now < bufferTime;
  }

  /**
   * LINE認証トークンを自動更新
   * @param providedRefreshToken 更新に使用するリフレッシュトークン（省略時はCookieから取得を試みる）
   * @returns 更新が成功したかどうか
   */
  static async renewLineToken(providedRefreshToken?: string | null): Promise<boolean> {
    try {
      const refreshToken = providedRefreshToken || this.getLineTokens().refreshToken;
      if (!refreshToken) return false;

      if (typeof window !== "undefined") {
        const event = new CustomEvent("auth:renew-line-token", {
          detail: { refreshToken },
        });
        window.dispatchEvent(event);
        return true;
      }
      return false;
    } catch (error) {
      logger.info("Failed to renew LINE token", {
        error: error instanceof Error ? error.message : String(error),
        component: "TokenManager",
      });
      return false;
    }
  }

  /**
   * 電話番号認証トークンを自動更新
   * @param providedRefreshToken 更新に使用するリフレッシュトークン（省略時はCookieから取得を試みる）
   * @returns 更新が成功したかどうか
   */
  static async renewPhoneToken(providedRefreshToken?: string | null): Promise<boolean> {
    try {
      const refreshToken = providedRefreshToken || this.getPhoneTokens().refreshToken;
      if (!refreshToken) return false;

      if (typeof window !== "undefined") {
        const event = new CustomEvent("auth:renew-phone-token", {
          detail: { refreshToken },
        });
        window.dispatchEvent(event);
        return true;
      }
      return false;
    } catch (error) {
      logger.info("Failed to renew phone token", {
        authType: "phone",
        error: error instanceof Error ? error.message : String(error),
        component: "TokenManager",
      });
      return false;
    }
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
