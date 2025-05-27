"use client";

import {
  PhoneAuthProvider,
  RecaptchaVerifier,
  signInWithCredential,
  signInWithPhoneNumber,
} from "firebase/auth";
import { phoneAuth, categorizeFirebaseError } from "./firebase-config";
import { TokenManager, PhoneAuthTokens } from "./token-manager";
import { isRunningInLiff } from "./environment-detector";

/**
 * 電話番号認証の状態
 */
export type PhoneAuthState = {
  isVerifying: boolean;
  isVerified: boolean;
  phoneNumber: string | null;
  phoneUid: string | null;
  verificationId: string | null;
  error: Error | null;
};

/**
 * 電話番号認証サービス
 */
export class PhoneAuthService {
  private static instance: PhoneAuthService;
  private state: PhoneAuthState;
  private recaptchaVerifier: RecaptchaVerifier | null = null;
  private recaptchaContainerElement: HTMLElement | null = null;

  /**
   * コンストラクタ
   */
  private constructor() {
    this.state = {
      isVerifying: false,
      isVerified: false,
      phoneNumber: null,
      phoneUid: null,
      verificationId: null,
      error: null,
    };

    const savedTokens = TokenManager.getPhoneTokens();
    if (savedTokens.phoneUid && savedTokens.phoneNumber) {
      this.state.isVerified = true;
      this.state.phoneUid = savedTokens.phoneUid;
      this.state.phoneNumber = savedTokens.phoneNumber;
    }
  }

  /**
   * シングルトンインスタンスを取得
   * @returns PhoneAuthServiceのインスタンス
   */
  public static getInstance(): PhoneAuthService {
    if (!PhoneAuthService.instance) {
      PhoneAuthService.instance = new PhoneAuthService();
    }
    return PhoneAuthService.instance;
  }

  /**
   * reCAPTCHAをクリア
   */
  public clearRecaptcha(): void {
    try {
      if (this.recaptchaVerifier) {
        this.recaptchaVerifier.clear();
        this.recaptchaVerifier = null;
      }

      if (this.recaptchaContainerElement) {
        if (document.getElementById("recaptcha-container")) {
          const iframes = this.recaptchaContainerElement.querySelectorAll("iframe");
          iframes.forEach((iframe) => iframe.remove());

          const divs = this.recaptchaContainerElement.querySelectorAll('div[id^="rc-"]');
          divs.forEach((div) => div.remove());
        }
        this.recaptchaContainerElement = null;
      }
    } catch (e) {
      console.error("Error clearing reCAPTCHA:", e);
    }
  }

  /**
   * 電話番号認証を開始
   * @param phoneNumber 電話番号
   * @returns 認証IDまたはnull（エラー時）
   */
  public async startPhoneVerification(phoneNumber: string): Promise<string | null> {
    try {
      this.state.isVerifying = true;
      this.state.error = null;
      this.clearRecaptcha();

      this.recaptchaContainerElement = document.getElementById("recaptcha-container");
      if (!this.recaptchaContainerElement) {
        throw new Error("reCAPTCHA container element not found");
      }

      this.recaptchaVerifier = new RecaptchaVerifier(phoneAuth, "recaptcha-container", {
        size: isRunningInLiff() ? "normal" : "invisible",
        callback: () => {},
        "expired-callback": () => {
          this.clearRecaptcha();
        },
      });

      await this.recaptchaVerifier.render();

      const confirmationResult = await signInWithPhoneNumber(
        phoneAuth,
        phoneNumber,
        this.recaptchaVerifier,
      );

      this.state.phoneNumber = phoneNumber;
      this.state.verificationId = confirmationResult.verificationId;

      return confirmationResult.verificationId;
    } catch (error) {
      console.error("Phone verification failed:", error);
      this.state.error = error as Error;
      return null;
    } finally {
      this.state.isVerifying = false;
    }
  }

  /**
   * 電話番号認証コードを検証
   * @param verificationCode 認証コード
   * @returns 検証が成功したかどうか
   */
  public async verifyPhoneCode(verificationCode: string): Promise<boolean> {
    try {
      this.state.isVerifying = true;
      this.state.error = null;

      console.log("Starting phone verification with code, using phoneAuth instance (no tenant)");

      if (!this.state.verificationId) {
        console.error("Missing verificationId");
        return false;
      }

      try {
        const credential = PhoneAuthProvider.credential(this.state.verificationId, verificationCode);
        console.log("Successfully created phone credential");

        try {
          console.log("Signing in with credential to get user ID");
          const userCredential = await signInWithCredential(phoneAuth, credential);
          console.log("Phone sign-in successful with credential");

          if (userCredential.user) {
            this.state.phoneUid = userCredential.user.uid;
            console.log("Stored phone UID:", this.state.phoneUid);

            const idToken = await userCredential.user.getIdToken();
            const refreshToken = userCredential.user.refreshToken;

            const tokenResult = await userCredential.user.getIdTokenResult();
            const expirationTime = new Date(tokenResult.expirationTime).getTime();

            const tokens: PhoneAuthTokens = {
              phoneUid: userCredential.user.uid,
              phoneNumber: this.state.phoneNumber,
              accessToken: idToken,
              refreshToken: refreshToken,
              expiresAt: expirationTime,
            };
            TokenManager.savePhoneTokens(tokens);

            console.log("Extracted phone auth tokens successfully");
          } else {
            console.error("No user returned from signInWithCredential");
          }

          await phoneAuth.signOut();
          console.log("Signed out of phone auth");
        } catch (signInError) {
          console.warn("Could not sign in with phone credential:", signInError);

          try {
            console.log("Attempting fallback with signInWithPhoneNumber");
            if (!this.state.phoneNumber || !this.recaptchaVerifier) {
              throw new Error("Missing phone number or recaptcha verifier for fallback");
            }

            const result = await signInWithPhoneNumber(
              phoneAuth,
              this.state.phoneNumber,
              this.recaptchaVerifier,
            );

            if (phoneAuth.currentUser) {
              this.state.phoneUid = phoneAuth.currentUser.uid;
              console.log("Stored phone UID from fallback:", this.state.phoneUid);

              const idToken = await phoneAuth.currentUser.getIdToken();
              const refreshToken = phoneAuth.currentUser.refreshToken;

              const tokenResult = await phoneAuth.currentUser.getIdTokenResult();
              const expirationTime = new Date(tokenResult.expirationTime).getTime();

              const tokens: PhoneAuthTokens = {
                phoneUid: phoneAuth.currentUser.uid,
                phoneNumber: this.state.phoneNumber,
                accessToken: idToken,
                refreshToken: refreshToken,
                expiresAt: expirationTime,
              };
              TokenManager.savePhoneTokens(tokens);

              console.log("Extracted phone auth tokens successfully (fallback)");
            }

            await phoneAuth.signOut();
          } catch (fallbackError) {
            console.error("Fallback also failed:", fallbackError);
          }
        }

        this.state.isVerified = true;
        console.log("Phone verification state set to verified:", this.state);
        return true;
      } catch (credentialError) {
        console.error("Invalid verification code:", credentialError);
        return false;
      }
    } catch (error) {
      console.error("Code verification failed:", error);
      this.state.error = error as Error;
      return false;
    } finally {
      this.state.isVerifying = false;
    }
  }

  /**
   * 電話番号認証トークンを更新
   * @returns 新しいトークンまたはnull（エラー時）
   */
  public async refreshPhoneIdToken(): Promise<string | null> {
    try {
      if (!phoneAuth.currentUser) {
        console.warn("Cannot refresh phone token: No authenticated user");
        return null;
      }

      const idToken = await phoneAuth.currentUser.getIdToken(true);
      const refreshToken = phoneAuth.currentUser.refreshToken;
      const tokenResult = await phoneAuth.currentUser.getIdTokenResult();
      const expirationTime = new Date(tokenResult.expirationTime).getTime();

      const tokens: PhoneAuthTokens = {
        phoneUid: phoneAuth.currentUser.uid,
        phoneNumber: this.state.phoneNumber,
        accessToken: idToken,
        refreshToken: refreshToken,
        expiresAt: expirationTime,
      };
      TokenManager.savePhoneTokens(tokens);

      return idToken;
    } catch (error) {
      console.error("Failed to refresh phone ID token:", error);
      return null;
    }
  }

  /**
   * 現在の電話番号認証状態を取得
   * @returns 電話番号認証状態
   */
  public getState(): PhoneAuthState {
    return { ...this.state };
  }

  /**
   * 電話番号認証状態をリセット
   */
  public reset(): void {
    this.clearRecaptcha();
    TokenManager.clearPhoneTokens();
    this.state = {
      isVerifying: false,
      isVerified: false,
      phoneNumber: null,
      phoneUid: null,
      verificationId: null,
      error: null,
    };
  }
}
