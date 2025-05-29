"use client";

import { lineAuth, phoneAuth } from "@/lib/auth/firebase-config";

/**
 * 認証トークンの型定義
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface PhoneAuthTokens extends AuthTokens {
  phoneUid: string;
  phoneNumber: string | null;
}

/**
 * トークンサービス - トークン管理を一元化
 */
export class TokenService {
  private static instance: TokenService;

  private constructor() {}

  /**
   * シングルトンインスタンスを取得
   */
  public static getInstance(): TokenService {
    if (!TokenService.instance) {
      TokenService.instance = new TokenService();
    }
    return TokenService.instance;
  }

  /**
   * LINEトークンを保存
   */
  public saveLineTokens(tokens: AuthTokens): void {
    console.log("👀 Saving line tokens...")
    if (typeof document !== "undefined") {
      document.cookie = `line_access_token=${tokens.accessToken}; path=/; secure; samesite=strict`;
      document.cookie = `line_refresh_token=${tokens.refreshToken}; path=/; secure; samesite=strict`;
      document.cookie = `line_expires_at=${tokens.expiresAt}; path=/; secure; samesite=strict`;
    }
  }

  /**
   * LINEトークンを取得
   */
  public getLineTokens(): AuthTokens {
    if (typeof document === "undefined") {
      return { accessToken: "", refreshToken: "", expiresAt: 0 };
    }

    const accessToken = this.getCookie("line_access_token") || "";
    const refreshToken = this.getCookie("line_refresh_token") || "";
    const expiresAt = parseInt(this.getCookie("line_expires_at") || "0", 10);

    return { accessToken, refreshToken, expiresAt };
  }

  /**
   * 電話番号認証トークンを保存
   */
  public savePhoneTokens(tokens: PhoneAuthTokens): void {
    if (typeof document !== "undefined") {
      document.cookie = `phone_access_token=${tokens.accessToken}; path=/; secure; samesite=strict`;
      document.cookie = `phone_refresh_token=${tokens.refreshToken}; path=/; secure; samesite=strict`;
      document.cookie = `phone_expires_at=${tokens.expiresAt}; path=/; secure; samesite=strict`;
      document.cookie = `phone_uid=${tokens.phoneUid}; path=/; secure; samesite=strict`;
      if (tokens.phoneNumber) {
        document.cookie = `phone_number=${tokens.phoneNumber}; path=/; secure; samesite=strict`;
      }
    }
  }

  /**
   * 電話番号認証トークンを取得
   */
  public getPhoneTokens(): PhoneAuthTokens {
    if (typeof document === "undefined") {
      return { accessToken: "", refreshToken: "", expiresAt: 0, phoneUid: "", phoneNumber: null };
    }

    const accessToken = this.getCookie("phone_access_token") || "";
    const refreshToken = this.getCookie("phone_refresh_token") || "";
    const expiresAt = parseInt(this.getCookie("phone_expires_at") || "0", 10);
    const phoneUid = this.getCookie("phone_uid") || "";
    const phoneNumber = this.getCookie("phone_number") || null;

    return { accessToken, refreshToken, expiresAt, phoneUid, phoneNumber };
  }

  /**
   * LINE認証トークンが有効かどうかを確認
   * @param tokens LINE認証トークン
   * @returns 有効かどうか
   */
  public async isLineTokenValid(tokens: AuthTokens): Promise<boolean> {
    if (!tokens.accessToken) {
      return false;
    }

    try {
      if (!lineAuth.currentUser) {
        return false;
      }

      await lineAuth.currentUser.getIdToken();
      return true;
    } catch (error) {
      console.error("LINE token validation failed:", error);
      return false;
    }
  }

  /**
   * 電話番号認証トークンが有効かどうかを確認
   * @param tokens 電話番号認証トークン
   * @returns 有効かどうか
   */
  public async isPhoneTokenValid(tokens: AuthTokens): Promise<boolean> {
    if (!tokens.accessToken) {
      return false;
    }

    try {
      if (!phoneAuth.currentUser) {
        return false;
      }

      await phoneAuth.currentUser.getIdToken();
      return true;
    } catch (error) {
      console.error("Phone token validation failed:", error);
      return false;
    }
  }

  /**
   * トークンが有効かどうかを確認（後方互換性のため）
   * @deprecated Use isLineTokenValid or isPhoneTokenValid instead
   */
  public async isTokenValid(tokens: AuthTokens): Promise<boolean> {
    try {
      const isLineValid = await this.isLineTokenValid(tokens);
      if (isLineValid) return true;

      const isPhoneValid = await this.isPhoneTokenValid(tokens);
      return isPhoneValid;
    } catch (error) {
      return false;
    }
  }

  /**
   * LINEトークンをクリア
   */
  public clearLineTokens(): void {
    if (typeof document !== "undefined") {
      document.cookie = "line_access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "line_refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "line_expires_at=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }

  /**
   * 電話番号認証トークンをクリア
   */
  public clearPhoneTokens(): void {
    if (typeof document !== "undefined") {
      document.cookie = "phone_access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "phone_refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "phone_expires_at=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "phone_uid=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "phone_number=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }

  /**
   * すべてのトークンをクリア
   */
  public clearAllTokens(): void {
    this.clearLineTokens();
    this.clearPhoneTokens();
  }

  /**
   * Cookieから値を取得
   */
  private getCookie(name: string): string | null {
    if (typeof document === "undefined") return null;

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const cookieValue = parts.pop()?.split(';').shift();
      return cookieValue || null;
    }
    return null;
  }
}
