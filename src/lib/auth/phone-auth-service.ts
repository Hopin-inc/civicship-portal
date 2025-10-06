"use client";

import {
  PhoneAuthProvider,
  RecaptchaVerifier,
  signInWithCredential,
  signInWithPhoneNumber,
} from "firebase/auth";
import { TokenManager } from "./token-manager";
import { isRunningInLiff } from "./environment-detector";
import { logger } from "@/lib/logging";
import { useAuthStore } from "@/hooks/auth/auth-store";
import { getPhoneAuth } from "@/lib/auth/firebase-config";

export class PhoneAuthService {
  private static instance: PhoneAuthService;
  private recaptchaVerifier: RecaptchaVerifier | null = null;
  private recaptchaContainerElement: HTMLElement | null = null;
  private isRecaptchaRendered: boolean = false;
  private recaptchaContainerId: string = "recaptcha-container";

  private constructor() {
    const isPhoneAuthenticated = TokenManager.getPhoneAuthFlag();
    if (isPhoneAuthenticated) {
      useAuthStore.getState().setPhoneAuth({
        isVerified: true,
      });
    }
  }

  public static getInstance(): PhoneAuthService {
    if (!PhoneAuthService.instance) {
      PhoneAuthService.instance = new PhoneAuthService();
    }
    return PhoneAuthService.instance;
  }

  private generateNewContainerId(): void {
    this.recaptchaContainerId = `recaptcha-container-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
  }

  public clearRecaptcha(): void {
    try {
      if (this.recaptchaVerifier) {
        this.recaptchaVerifier.clear();
        this.recaptchaVerifier = null;
      }
      if (this.recaptchaContainerElement) {
        const existingRecaptcha = this.recaptchaContainerElement.querySelector(".grecaptcha-badge");
        if (existingRecaptcha) {
          existingRecaptcha.remove();
        }
        this.recaptchaContainerElement.innerHTML = "";
      }
      if (typeof window !== "undefined" && (window as any).grecaptcha) {
        try {
          (window as any).grecaptcha.reset();
        } catch (e) {
          logger.info("reCAPTCHA reset (expected)", {
            authType: "phone",
            error: e instanceof Error ? e.message : String(e),
            component: "PhoneAuthService",
          });
        }
      }
      this.recaptchaContainerElement = null;
      this.isRecaptchaRendered = false;
    } catch (e) {
      logger.info("Error clearing reCAPTCHA", {
        authType: "phone",
        error: e instanceof Error ? e.message : String(e),
        component: "PhoneAuthService",
      });
    }
  }

  public async startPhoneVerification(phoneNumber: string): Promise<string | null> {
    try {
      this.clearRecaptcha();
      this.generateNewContainerId();
      await new Promise((resolve) => setTimeout(resolve, 500));

      const baseContainer = document.getElementById("recaptcha-container");
      if (!baseContainer) {
        throw new Error("Base reCAPTCHA container element not found");
      }

      const newContainer = document.createElement("div");
      newContainer.id = this.recaptchaContainerId;
      baseContainer.appendChild(newContainer);

      this.recaptchaContainerElement = newContainer;

      this.recaptchaVerifier = new RecaptchaVerifier(getPhoneAuth(), this.recaptchaContainerId, {
        size: isRunningInLiff() ? "normal" : "invisible",
        callback: () => {
          logger.debug("reCAPTCHA completed", {
            authType: "phone",
            component: "PhoneAuthService",
            environment: isRunningInLiff() ? "liff" : "browser",
          });
          if (isRunningInLiff()) {
            window.dispatchEvent(new CustomEvent("recaptcha-completed"));
          }
        },
        "expired-callback": () => this.clearRecaptcha(),
      });

      await this.recaptchaVerifier.render();

      const confirmationResult = await signInWithPhoneNumber(
        getPhoneAuth(),
        phoneNumber,
        this.recaptchaVerifier,
      );

      return confirmationResult.verificationId;
    } catch (error) {
      logger.error("Phone verification start failed", {
        error: error instanceof Error ? error.message : String(error),
        phoneNumber,
        component: "PhoneAuthService",
      });
      throw error;
    }
  }

  public async verifyPhoneCode(verificationCode: string): Promise<{
    success: boolean;
    phoneUid?: string;
    tokens?: { accessToken: string; refreshToken: string; expiresAt: number };
  }> {
    const phoneAuthState = useAuthStore.getState().phoneAuth;
    if (!phoneAuthState.verificationId) {
      logger.error("Missing verificationId", { component: "PhoneAuthService" });
      return { success: false };
    }

    try {
      const credential = PhoneAuthProvider.credential(
        phoneAuthState.verificationId,
        verificationCode,
      );
      const userCredential = await signInWithCredential(getPhoneAuth(), credential);

      if (!userCredential.user) {
        return { success: false };
      }

      const idToken = await userCredential.user.getIdToken();
      const refreshToken = userCredential.user.refreshToken;
      const tokenResult = await userCredential.user.getIdTokenResult();
      const expirationTime = new Date(tokenResult.expirationTime).getTime();

      return {
        success: true,
        phoneUid: userCredential.user.uid,
        tokens: {
          accessToken: idToken,
          refreshToken,
          expiresAt: expirationTime,
        },
      };
    } catch (error) {
      logger.error("verifyPhoneCode failed", {
        error: error instanceof Error ? error.message : String(error),
        component: "PhoneAuthService",
      });
      return { success: false };
    }
  }

  public reset(): void {
    this.clearRecaptcha();
    TokenManager.clearPhoneAuthFlag();
    useAuthStore.getState().setPhoneAuth({
      isVerifying: false,
      isVerified: false,
      phoneNumber: null,
      phoneUid: null,
      verificationId: null,
      error: null,
      phoneTokens: {
        accessToken: null,
        refreshToken: null,
        expiresAt: null,
      },
    });
  }
}
