"use client";

import logger from "../logging";
import { 
  createAuthLogContext, 
  maskUserId, 
  generateRequestId 
} from "./logging-utils";

/**
 * 認証トークン情報の型定義
 */
export interface AuthTokens {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
}

/**
 * 電話番号認証トークン情報の型定義
 */
export interface PhoneAuthTokens {
  phoneUid: string | null;
  phoneNumber: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
}

/**
 * 認証トークンを管理するクラス
 */
export class TokenManager {
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
   * @param sessionId セッションID（ログ追跡用）
   */
  static saveLineTokens(tokens: AuthTokens, sessionId?: string): void {
    const requestId = generateRequestId();
    const sid = sessionId || 'unknown_session';
    
    logger.info("SaveLineTokens", createAuthLogContext(
      sid,
      "general",
      {
        event: "SaveLineTokens",
        component: "TokenManager",
        requestId,
        hasAccessToken: !!tokens.accessToken,
        hasRefreshToken: !!tokens.refreshToken,
        hasExpiresAt: !!tokens.expiresAt,
        expiresIn: tokens.expiresAt ? Math.floor((tokens.expiresAt - Date.now()) / 1000) : null
      }
    ));
    
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
   * @param sessionId セッションID（ログ追跡用）
   */
  static savePhoneTokens(tokens: PhoneAuthTokens, sessionId?: string): void {
    const requestId = generateRequestId();
    const sid = sessionId || 'unknown_session';
    
    logger.info("SavePhoneTokens", createAuthLogContext(
      sid,
      "general",
      {
        event: "SavePhoneTokens",
        component: "TokenManager",
        requestId,
        hasPhoneUid: !!tokens.phoneUid,
        hasPhoneNumber: !!tokens.phoneNumber,
        hasAccessToken: !!tokens.accessToken,
        hasRefreshToken: !!tokens.refreshToken,
        hasExpiresAt: !!tokens.expiresAt,
        expiresIn: tokens.expiresAt ? Math.floor((tokens.expiresAt - Date.now()) / 1000) : null,
        phoneUid: tokens.phoneUid ? maskUserId(tokens.phoneUid) : null
      }
    ));
    
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
   * @param sessionId セッションID（ログ追跡用）
   * @returns 取得したトークン情報
   */
  static getLineTokens(sessionId?: string): AuthTokens {
    const requestId = generateRequestId();
    const sid = sessionId || 'unknown_session';
    
    const accessToken = this.getCookie(this.LINE_ACCESS_TOKEN_KEY);
    const refreshToken = this.getCookie(this.LINE_REFRESH_TOKEN_KEY);
    const expiresAtStr = this.getCookie(this.LINE_TOKEN_EXPIRES_AT_KEY);
    
    const tokens = {
      accessToken,
      refreshToken,
      expiresAt: expiresAtStr ? parseInt(expiresAtStr, 10) : null,
    };
    
    logger.debug("GetLineTokens", createAuthLogContext(
      sid,
      "general",
      {
        event: "GetLineTokens",
        component: "TokenManager",
        requestId,
        hasAccessToken: !!tokens.accessToken,
        hasRefreshToken: !!tokens.refreshToken,
        hasExpiresAt: !!tokens.expiresAt,
        expiresIn: tokens.expiresAt ? Math.floor((tokens.expiresAt - Date.now()) / 1000) : null
      }
    ));
    
    return tokens;
  }

  /**
   * 電話番号認証トークンをCookieから取得
   * @param sessionId セッションID（ログ追跡用）
   * @returns 取得したトークン情報
   */
  static getPhoneTokens(sessionId?: string): PhoneAuthTokens {
    const requestId = generateRequestId();
    const sid = sessionId || 'unknown_session';
    
    const phoneUid = this.getCookie(this.PHONE_UID_KEY);
    const phoneNumber = this.getCookie(this.PHONE_NUMBER_KEY);
    const accessToken = this.getCookie(this.PHONE_ACCESS_TOKEN_KEY);
    const refreshToken = this.getCookie(this.PHONE_REFRESH_TOKEN_KEY);
    const expiresAtStr = this.getCookie(this.PHONE_TOKEN_EXPIRES_AT_KEY);
    
    const tokens = {
      phoneUid,
      phoneNumber,
      accessToken,
      refreshToken,
      expiresAt: expiresAtStr ? parseInt(expiresAtStr, 10) : null,
    };
    
    logger.debug("GetPhoneTokens", createAuthLogContext(
      sid,
      "general",
      {
        event: "GetPhoneTokens",
        component: "TokenManager",
        requestId,
        hasPhoneUid: !!tokens.phoneUid,
        hasPhoneNumber: !!tokens.phoneNumber,
        hasAccessToken: !!tokens.accessToken,
        hasRefreshToken: !!tokens.refreshToken,
        hasExpiresAt: !!tokens.expiresAt,
        expiresIn: tokens.expiresAt ? Math.floor((tokens.expiresAt - Date.now()) / 1000) : null,
        phoneUid: tokens.phoneUid ? maskUserId(tokens.phoneUid) : null
      }
    ));
    
    return tokens;
  }

  /**
   * LINE認証トークンをCookieから削除
   * @param sessionId セッションID（ログ追跡用）
   */
  static clearLineTokens(sessionId?: string): void {
    const requestId = generateRequestId();
    const sid = sessionId || 'unknown_session';
    
    logger.info("ClearLineTokens", createAuthLogContext(
      sid,
      "general",
      {
        event: "ClearLineTokens",
        component: "TokenManager",
        requestId
      }
    ));
    
    this.deleteCookie(this.LINE_ACCESS_TOKEN_KEY);
    this.deleteCookie(this.LINE_REFRESH_TOKEN_KEY);
    this.deleteCookie(this.LINE_TOKEN_EXPIRES_AT_KEY);
  }

  /**
   * 電話番号認証トークンをCookieから削除
   * @param sessionId セッションID（ログ追跡用）
   */
  static clearPhoneTokens(sessionId?: string): void {
    const requestId = generateRequestId();
    const sid = sessionId || 'unknown_session';
    
    logger.info("ClearPhoneTokens", createAuthLogContext(
      sid,
      "general",
      {
        event: "ClearPhoneTokens",
        component: "TokenManager",
        requestId
      }
    ));
    
    this.deleteCookie(this.PHONE_UID_KEY);
    this.deleteCookie(this.PHONE_NUMBER_KEY);
    this.deleteCookie(this.PHONE_ACCESS_TOKEN_KEY);
    this.deleteCookie(this.PHONE_REFRESH_TOKEN_KEY);
    this.deleteCookie(this.PHONE_TOKEN_EXPIRES_AT_KEY);
  }

  /**
   * すべての認証トークンをCookieから削除
   * @param sessionId セッションID（ログ追跡用）
   */
  static clearAllTokens(sessionId?: string): void {
    const requestId = generateRequestId();
    const sid = sessionId || 'unknown_session';
    
    logger.info("ClearAllTokens", createAuthLogContext(
      sid,
      "general",
      {
        event: "ClearAllTokens",
        component: "TokenManager",
        requestId
      }
    ));
    
    this.clearLineTokens(sid);
    this.clearPhoneTokens(sid);
  }

  /**
   * LINE認証トークンが有効期限切れかどうかを確認
   * @param sessionId セッションID（ログ追跡用）
   * @returns 有効期限切れの場合はtrue
   */
  static isLineTokenExpired(sessionId?: string): boolean {
    const requestId = generateRequestId();
    const sid = sessionId || 'unknown_session';
    
    const { expiresAt } = this.getLineTokens(sid);
    if (!expiresAt) {
      logger.info("LineTokenExpired", createAuthLogContext(
        sid,
        "general",
        {
          event: "TokenExpired",
          component: "TokenManager",
          requestId,
          tokenType: "line",
          reason: "no_expiry_time"
        }
      ));
      return true;
    }
    
    const now = Date.now();
    const bufferTime = 5 * 60 * 1000; // 5分（ミリ秒）
    const isExpired = expiresAt - now < bufferTime;
    
    if (isExpired) {
      logger.info("LineTokenExpired", createAuthLogContext(
        sid,
        "general",
        {
          event: "TokenExpired",
          component: "TokenManager",
          requestId,
          tokenType: "line",
          reason: "time_expired",
          expiresIn: Math.floor((expiresAt - now) / 1000)
        }
      ));
    }
    
    return isExpired;
  }

  /**
   * 電話番号認証トークンが有効期限切れかどうかを確認
   * @param sessionId セッションID（ログ追跡用）
   * @returns 有効期限切れの場合はtrue
   */
  static isPhoneTokenExpired(sessionId?: string): boolean {
    const requestId = generateRequestId();
    const sid = sessionId || 'unknown_session';
    
    const { expiresAt, phoneUid } = this.getPhoneTokens(sid);
    if (!expiresAt) {
      logger.info("PhoneTokenExpired", createAuthLogContext(
        sid,
        "general",
        {
          event: "TokenExpired",
          component: "TokenManager",
          requestId,
          tokenType: "phone",
          reason: "no_expiry_time",
          phoneUid: phoneUid ? maskUserId(phoneUid) : null
        }
      ));
      return true;
    }
    
    const now = Date.now();
    const bufferTime = 5 * 60 * 1000; // 5分（ミリ秒）
    const isExpired = expiresAt - now < bufferTime;
    
    if (isExpired) {
      logger.info("PhoneTokenExpired", createAuthLogContext(
        sid,
        "general",
        {
          event: "TokenExpired",
          component: "TokenManager",
          requestId,
          tokenType: "phone",
          reason: "time_expired",
          expiresIn: Math.floor((expiresAt - now) / 1000),
          phoneUid: phoneUid ? maskUserId(phoneUid) : null
        }
      ));
    }
    
    return isExpired;
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
    return cookie ? cookie.split("=")[1] : null;
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
