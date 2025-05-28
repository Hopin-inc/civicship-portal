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
import logger from "../logging";

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
    if (savedTokens.phoneUid && savedTokens.phoneNumber && savedTokens.accessToken) {
      this.state.isVerified = true;
      this.state.phoneUid = savedTokens.phoneUid;
      this.state.phoneNumber = savedTokens.phoneNumber;
      
      logger.debug("Phone verification state initialized from saved tokens", {
        isVerified: this.state.isVerified,
        phoneUid: this.state.phoneUid ? "exists" : "missing",
        phoneNumber: this.state.phoneNumber ? "exists" : "missing",
        accessToken: savedTokens.accessToken ? "exists" : "missing"
      });
    } else {
      logger.debug("Phone verification not initialized - incomplete saved tokens", {
        phoneUid: savedTokens.phoneUid ? "exists" : "missing",
        phoneNumber: savedTokens.phoneNumber ? "exists" : "missing",
        accessToken: savedTokens.accessToken ? "exists" : "missing"
      });
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
      logger.warn("Error clearing reCAPTCHA", {
        error: e instanceof Error ? e.message : String(e)
      });
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
      logger.info("Phone verification failed", {
        error: error instanceof Error ? error.message : String(error),
        phoneNumber: this.state.phoneNumber ? "provided" : "missing"
      });
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

      logger.debug("Starting phone verification with code, using phoneAuth instance (no tenant)");

      if (!this.state.verificationId) {
        logger.info("Missing verificationId for phone verification", {
          operation: "verifyPhoneCode"
        });
        return false;
      }

      try {
        const credential = PhoneAuthProvider.credential(this.state.verificationId, verificationCode);
        logger.debug("Successfully created phone credential");

        try {
          logger.debug("Signing in with credential to get user ID");
          const userCredential = await signInWithCredential(phoneAuth, credential);
          logger.info("Phone sign-in successful with credential");

          if (userCredential.user) {
            this.state.phoneUid = userCredential.user.uid;
            logger.debug("Stored phone UID", { uid: this.state.phoneUid });

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

            logger.debug("Extracted phone auth tokens successfully");
          } else {
            logger.error("No user returned from signInWithCredential", {
              operation: "verifyPhoneCode"
            });
          }

          await phoneAuth.signOut();
          logger.debug("Signed out of phone auth");
        } catch (signInError) {
          logger.info("Could not sign in with phone credential", {
            error: signInError instanceof Error ? signInError.message : String(signInError)
          });

          try {
            logger.debug("Attempting fallback with signInWithPhoneNumber");
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
              logger.debug("Stored phone UID from fallback", { uid: this.state.phoneUid });

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

              logger.debug("Extracted phone auth tokens successfully (fallback)");
            }

            await phoneAuth.signOut();
          } catch (fallbackError) {
            logger.error("Phone verification fallback failed", {
              error: fallbackError instanceof Error ? fallbackError.message : String(fallbackError)
            });
          }
        }

        this.state.isVerified = true;
        logger.info("Phone verification state set to verified", {
          phoneNumber: this.state.phoneNumber,
          phoneUid: this.state.phoneUid
        });
        return true;
      } catch (credentialError) {
        logger.info("Invalid verification code", {
          error: credentialError instanceof Error ? credentialError.message : String(credentialError)
        });
        return false;
      }
    } catch (error) {
      logger.error("Code verification failed", {
        error: error instanceof Error ? error.message : String(error)
      });
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
        logger.info("Cannot refresh phone token: No authenticated user");
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
      logger.error("Failed to refresh phone ID token", {
        error: error instanceof Error ? error.message : String(error)
      });
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
