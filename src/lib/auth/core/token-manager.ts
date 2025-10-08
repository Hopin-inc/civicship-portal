"use client";

export class TokenManager {
  private static readonly LINE_AUTHENTICATED_KEY = "line_authenticated";
  private static readonly PHONE_AUTHENTICATED_KEY = "phone_authenticated";
  private static readonly PHONE_ACCESS_TOKEN_KEY = "phone_auth_token";

  static saveLineAuthFlag(isAuthenticated: boolean): void {
    this.setCookie(this.LINE_AUTHENTICATED_KEY, isAuthenticated.toString());
  }

  static savePhoneAuthFlag(isAuthenticated: boolean): void {
    this.setCookie(this.PHONE_AUTHENTICATED_KEY, isAuthenticated.toString());
  }

  static getPhoneAuthFlag(): boolean {
    return this.getCookie(this.PHONE_AUTHENTICATED_KEY) === "true";
  }

  static phoneVerified(): boolean {
    const accessToken = this.getCookie(this.PHONE_ACCESS_TOKEN_KEY);
    return accessToken !== null;
  }

  static clearLineAuthFlag(): void {
    this.deleteCookie(this.LINE_AUTHENTICATED_KEY);
  }

  static clearPhoneAuthFlag(): void {
    this.deleteCookie(this.PHONE_AUTHENTICATED_KEY);
  }

  static clearAllAuthFlags(): void {
    this.clearLineAuthFlag();
    this.clearPhoneAuthFlag();
  }

  private static setCookie(name: string, value: string, days = 30): void {
    if (typeof document === "undefined") return;

    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
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
