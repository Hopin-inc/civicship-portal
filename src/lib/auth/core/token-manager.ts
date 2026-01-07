"use client";

import { extractCommunityIdFromPath } from "@/lib/communities/communityIds";

export class TokenManager {
  // Base cookie names - will be suffixed with community ID for multi-tenant isolation
  private static readonly LINE_AUTHENTICATED_BASE = "line_authenticated";
  private static readonly PHONE_AUTHENTICATED_BASE = "phone_authenticated";
  private static readonly PHONE_ACCESS_TOKEN_KEY = "phone_auth_token";

  private static getCurrentCommunityId(): string | null {
    if (typeof window === "undefined") return null;
    return extractCommunityIdFromPath(window.location.pathname);
  }

  // Get community-specific cookie name
  // e.g., "line_authenticated_neo88" for neo88 community
  private static getCommunitySpecificKey(baseKey: string, communityId?: string): string {
    const effectiveCommunityId = communityId ?? this.getCurrentCommunityId();
    if (!effectiveCommunityId) return baseKey;
    return `${baseKey}_${effectiveCommunityId}`;
  }

  static saveLineAuthFlag(isAuthenticated: boolean, communityId?: string): void {
    const key = this.getCommunitySpecificKey(this.LINE_AUTHENTICATED_BASE, communityId);
    this.setCookie(key, isAuthenticated.toString());
  }

  static savePhoneAuthFlag(isAuthenticated: boolean, communityId?: string): void {
    const key = this.getCommunitySpecificKey(this.PHONE_AUTHENTICATED_BASE, communityId);
    this.setCookie(key, isAuthenticated.toString());
  }

  static getLineAuthFlag(communityId?: string): boolean {
    const key = this.getCommunitySpecificKey(this.LINE_AUTHENTICATED_BASE, communityId);
    return this.getCookie(key) === "true";
  }

  static getPhoneAuthFlag(communityId?: string): boolean {
    const key = this.getCommunitySpecificKey(this.PHONE_AUTHENTICATED_BASE, communityId);
    return this.getCookie(key) === "true";
  }

  static phoneVerified(): boolean {
    const accessToken = this.getCookie(this.PHONE_ACCESS_TOKEN_KEY);
    return accessToken !== null;
  }

  static clearLineAuthFlag(communityId?: string): void {
    const key = this.getCommunitySpecificKey(this.LINE_AUTHENTICATED_BASE, communityId);
    this.deleteCookie(key);
    // Also clear legacy cookies without community suffix
    this.deleteCookie(this.LINE_AUTHENTICATED_BASE);
    this.deleteCookieAtPath(this.LINE_AUTHENTICATED_BASE, "/");
  }

  static clearPhoneAuthFlag(communityId?: string): void {
    const key = this.getCommunitySpecificKey(this.PHONE_AUTHENTICATED_BASE, communityId);
    this.deleteCookie(key);
    // Also clear legacy cookies without community suffix
    this.deleteCookie(this.PHONE_AUTHENTICATED_BASE);
    this.deleteCookieAtPath(this.PHONE_AUTHENTICATED_BASE, "/");
  }

  static clearAllAuthFlags(communityId?: string): void {
    this.clearLineAuthFlag(communityId);
    this.clearPhoneAuthFlag(communityId);
  }

  static clearGlobalAuthFlags(): void {
    this.deleteCookieAtPath(this.LINE_AUTHENTICATED_BASE, "/");
    this.deleteCookieAtPath(this.PHONE_AUTHENTICATED_BASE, "/");
    this.deleteCookieAtPath(this.PHONE_ACCESS_TOKEN_KEY, "/");
  }

  private static setCookie(name: string, value: string, days = 30): void {
    if (typeof document === "undefined") return;

    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    // Use root path for all cookies since we're using community-specific names
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  }

  private static getCookie(name: string): string | null {
    if (typeof document === "undefined") return null;

    const cookies = document.cookie.split("; ");
    const cookie = cookies.find((c) => c.startsWith(`${name}=`));
    const [_, ...cookieValues] = cookie?.split("=") ?? [];
    return cookieValues?.length ? cookieValues.join("=") : null;
  }

  private static deleteCookie(name: string): void {
    if (typeof document === "undefined") return;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax`;
  }

  private static deleteCookieAtPath(name: string, path: string): void {
    if (typeof document === "undefined") return;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${path};SameSite=Lax`;
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
    this.clearGlobalAuthFlags();
  }
}
