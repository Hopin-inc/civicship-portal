"use client";

import {
  PhoneAuthProvider,
  RecaptchaVerifier,
  signInWithCredential,
  signInWithPhoneNumber,
} from "firebase/auth";
import { phoneAuth } from "./firebase-config";
import { PhoneAuthTokens, TokenManager } from "./token-manager";
import { isRunningInLiff } from "./environment-detector";
import { createAuthLogContext, generateSessionId, maskPhoneNumber } from "../logging/client/utils";
import { logger } from "@/lib/logging";

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
  private isRecaptchaRendered: boolean = false;

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
        accessToken: savedTokens.accessToken ? "exists" : "missing",
        component: "PhoneAuthService",
      });
    } else {
      logger.debug("Phone verification not initialized - incomplete saved tokens", {
        phoneUid: savedTokens.phoneUid ? "exists" : "missing",
        phoneNumber: savedTokens.phoneNumber ? "exists" : "missing",
        accessToken: savedTokens.accessToken ? "exists" : "missing",
        component: "PhoneAuthService",
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
        this.recaptchaContainerElement.innerHTML = "";
      }
      this.recaptchaContainerElement = null;
      this.isRecaptchaRendered = false;
    } catch (e) {
      logger.info(
        "Error clearing reCAPTCHA",
        createAuthLogContext(generateSessionId(), "phone", {
          error: e instanceof Error ? e.message : String(e),
          component: "PhoneAuthService",
        }),
      );
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

      // 前回のVerifierを明示的にクリア（DOM操作しない）
      this.clearRecaptcha();

      // Googleの内部非同期処理との競合を避けるため少し待つ
      await new Promise((resolve) => setTimeout(resolve, 100));

      this.recaptchaContainerElement = document.getElementById("recaptcha-container");
      if (!this.recaptchaContainerElement) {
        throw new Error("reCAPTCHA container element not found");
      }

      // 新しいインスタンスを作る
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
      logger.info(
        "Phone verification failed",
        createAuthLogContext(generateSessionId(), "phone", {
          error: error instanceof Error ? error.message : String(error),
          component: "PhoneAuthService",
          phoneNumber: maskPhoneNumber(phoneNumber),
        }),
      );
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

      if (!this.state.verificationId) {
        logger.error("Missing verificationId", {
          component: "PhoneAuthService",
        });
        return false;
      }

      try {
        const credential = PhoneAuthProvider.credential(
          this.state.verificationId,
          verificationCode,
        );
        logger.debug("Successfully created phone credential", {
          component: "PhoneAuthService",
        });

        let verificationSuccessful = false;

        try {
          const userCredential = await signInWithCredential(phoneAuth, credential);
          logger.debug("Phone sign-in successful with credential", {
            component: "PhoneAuthService",
          });

          if (userCredential.user) {
            this.state.phoneUid = userCredential.user.uid;

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
            verificationSuccessful = true;
          } else {
            logger.error("No user returned from signInWithCredential", {
              component: "PhoneAuthService",
            });
          }

          await phoneAuth.signOut();
          logger.debug("Signed out of phone auth", {
            component: "PhoneAuthService",
          });
        } catch (signInError) {
          logger.info(
            "Could not sign in with phone credential",
            createAuthLogContext(generateSessionId(), "phone", {
              error: signInError instanceof Error ? signInError.message : String(signInError),
              component: "PhoneAuthService",
            }),
          );
          logger.debug("Verification failed - invalid code", {
            component: "PhoneAuthService",
          });
          return false;
        }

        if (verificationSuccessful) {
          this.state.isVerified = true;
          logger.debug("Phone verification state set to verified", {
            isVerified: this.state.isVerified,
            component: "PhoneAuthService",
          });
          return true;
        } else {
          return false;
        }
      } catch (credentialError) {
        logger.info(
          "Invalid verification code",
          createAuthLogContext(generateSessionId(), "phone", {
            error:
              credentialError instanceof Error ? credentialError.message : String(credentialError),
            component: "PhoneAuthService",
          }),
        );
        return false;
      }
    } catch (error) {
      logger.info(
        "Code verification failed",
        createAuthLogContext(generateSessionId(), "phone", {
          error: error instanceof Error ? error.message : String(error),
          component: "PhoneAuthService",
        }),
      );
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
        logger.info(
          "Cannot refresh phone token: No authenticated user",
          createAuthLogContext(generateSessionId(), "phone", { component: "PhoneAuthService" }),
        );
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
      logger.info(
        "Failed to refresh phone ID token",
        createAuthLogContext(generateSessionId(), "phone", {
          error: error instanceof Error ? error.message : String(error),
          component: "PhoneAuthService",
        }),
      );
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
