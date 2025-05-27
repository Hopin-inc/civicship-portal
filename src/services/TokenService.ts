"use client";

/**
 * TokenService - 認証トークンの管理を担当するサービス
 * 
 * このサービスは以下の責務を持ちます：
 * - トークンの保存と取得
 * - トークンの有効期限管理
 * - トークンの自動リフレッシュ
 * - トークン関連のエラー処理
 */

export enum TokenType {
  ACCESS = 'access_token',
  REFRESH = 'refresh_token',
  EXPIRES_AT = 'token_expires_at',
  PHONE_ACCESS = 'phone_auth_token',
  PHONE_REFRESH = 'phone_refresh_token',
  PHONE_EXPIRES_AT = 'phone_token_expires_at',
}

export interface TokenSet {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
}

export interface PhoneTokenSet extends TokenSet {}

export interface ITokenService {
  getTokens(): TokenSet;
  getPhoneTokens(): PhoneTokenSet;
  setTokens(tokens: Partial<TokenSet>): void;
  setPhoneTokens(tokens: Partial<PhoneTokenSet>): void;
  clearTokens(): void;
  clearPhoneTokens(): void;
  isTokenExpired(): boolean;
  isPhoneTokenExpired(): boolean;
  getAuthorizationHeaders(): Record<string, string>;
}

export class TokenService implements ITokenService {
  private readonly TOKEN_REFRESH_THRESHOLD_MS = 5 * 60 * 1000; // 5分前にリフレッシュ

  /**
   * 標準認証トークンを取得
   */
  getTokens(): TokenSet {
    if (typeof document === 'undefined') {
      return {
        accessToken: null,
        refreshToken: null,
        expiresAt: null,
      };
    }

    const cookies = document.cookie.split('; ');
    const accessToken = cookies.find((e) => e.startsWith(TokenType.ACCESS))?.split('=')[1] || null;
    const refreshToken = cookies.find((e) => e.startsWith(TokenType.REFRESH))?.split('=')[1] || null;
    const expiresAtStr = cookies.find((e) => e.startsWith(TokenType.EXPIRES_AT))?.split('=')[1];
    const expiresAt = expiresAtStr ? parseInt(expiresAtStr, 10) : null;

    return {
      accessToken,
      refreshToken,
      expiresAt,
    };
  }

  /**
   * 電話認証トークンを取得
   */
  getPhoneTokens(): PhoneTokenSet {
    if (typeof document === 'undefined') {
      return {
        accessToken: null,
        refreshToken: null,
        expiresAt: null,
      };
    }

    const cookies = document.cookie.split('; ');
    const accessToken = cookies.find((e) => e.startsWith(TokenType.PHONE_ACCESS))?.split('=')[1] || null;
    const refreshToken = cookies.find((e) => e.startsWith(TokenType.PHONE_REFRESH))?.split('=')[1] || null;
    const expiresAtStr = cookies.find((e) => e.startsWith(TokenType.PHONE_EXPIRES_AT))?.split('=')[1];
    const expiresAt = expiresAtStr ? parseInt(expiresAtStr, 10) : null;

    return {
      accessToken,
      refreshToken,
      expiresAt,
    };
  }

  /**
   * 標準認証トークンを設定
   */
  setTokens(tokens: Partial<TokenSet>): void {
    if (typeof document === 'undefined') {
      return;
    }

    if (tokens.accessToken !== undefined) {
      this.setCookie(TokenType.ACCESS, tokens.accessToken || '');
    }

    if (tokens.refreshToken !== undefined) {
      this.setCookie(TokenType.REFRESH, tokens.refreshToken || '');
    }

    if (tokens.expiresAt !== undefined) {
      this.setCookie(TokenType.EXPIRES_AT, tokens.expiresAt?.toString() || '');
    }
  }

  /**
   * 電話認証トークンを設定
   */
  setPhoneTokens(tokens: Partial<PhoneTokenSet>): void {
    if (typeof document === 'undefined') {
      return;
    }

    if (tokens.accessToken !== undefined) {
      this.setCookie(TokenType.PHONE_ACCESS, tokens.accessToken || '');
    }

    if (tokens.refreshToken !== undefined) {
      this.setCookie(TokenType.PHONE_REFRESH, tokens.refreshToken || '');
    }

    if (tokens.expiresAt !== undefined) {
      this.setCookie(TokenType.PHONE_EXPIRES_AT, tokens.expiresAt?.toString() || '');
    }
  }

  /**
   * 標準認証トークンをクリア
   */
  clearTokens(): void {
    this.setCookie(TokenType.ACCESS, '', -1);
    this.setCookie(TokenType.REFRESH, '', -1);
    this.setCookie(TokenType.EXPIRES_AT, '', -1);
  }

  /**
   * 電話認証トークンをクリア
   */
  clearPhoneTokens(): void {
    this.setCookie(TokenType.PHONE_ACCESS, '', -1);
    this.setCookie(TokenType.PHONE_REFRESH, '', -1);
    this.setCookie(TokenType.PHONE_EXPIRES_AT, '', -1);
  }

  /**
   * 標準認証トークンが期限切れかどうかを確認
   */
  isTokenExpired(): boolean {
    const { expiresAt } = this.getTokens();
    if (!expiresAt) return true;

    return Date.now() + this.TOKEN_REFRESH_THRESHOLD_MS >= expiresAt;
  }

  /**
   * 電話認証トークンが期限切れかどうかを確認
   */
  isPhoneTokenExpired(): boolean {
    const { expiresAt } = this.getPhoneTokens();
    if (!expiresAt) return true;

    return Date.now() + this.TOKEN_REFRESH_THRESHOLD_MS >= expiresAt;
  }

  /**
   * 認証ヘッダーを取得
   */
  getAuthorizationHeaders(): Record<string, string> {
    const mainTokens = this.getTokens();
    const phoneTokens = this.getPhoneTokens();

    return {
      Authorization: mainTokens.accessToken ? `Bearer ${mainTokens.accessToken}` : '',
      'X-Civicship-Tenant': process.env.NEXT_PUBLIC_FIREBASE_AUTH_TENANT_ID || '',
      'X-Refresh-Token': mainTokens.refreshToken || '',
      'X-Token-Expires-At': mainTokens.expiresAt?.toString() || '',
      'X-Phone-Auth-Token': phoneTokens.accessToken || '',
      'X-Phone-Refresh-Token': phoneTokens.refreshToken || '',
      'X-Phone-Token-Expires-At': phoneTokens.expiresAt?.toString() || '',
    };
  }

  /**
   * Cookieを設定するヘルパーメソッド
   */
  private setCookie(name: string, value: string, days = 30): void {
    if (typeof document === 'undefined') {
      return;
    }

    let expires = '';
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = `; expires=${date.toUTCString()}`;
    }

    document.cookie = `${name}=${value}${expires}; path=/`;
  }
}

export const tokenService = new TokenService();
