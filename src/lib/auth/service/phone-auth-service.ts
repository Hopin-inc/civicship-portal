"use client";

import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { TokenManager } from "../core/token-manager";
import { isRunningInLiff } from "../core/environment-detector";
import { logger } from "@/lib/logging";
import { useAuthStore } from "@/lib/auth/core/auth-store";
import { getPhoneAuth, logFirebaseError } from "@/lib/auth/core/firebase-config";

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
          logger.debug("reCAPTCHA reset (expected)", {
            authType: "phone",
            error: e instanceof Error ? e.message : String(e),
            component: "PhoneAuthService",
          });
        }
      }
      this.recaptchaContainerElement = null;
      this.isRecaptchaRendered = false;
    } catch (e) {
      logger.debug("Error clearing reCAPTCHA", {
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
        logger.error("[PhoneAuthService] Base container not found");
        throw new Error("Base reCAPTCHA container element not found");
      }

      const newContainer = document.createElement("div");
      newContainer.id = this.recaptchaContainerId;
      baseContainer.appendChild(newContainer);

      this.recaptchaContainerElement = newContainer;

      const recaptchaSize = isRunningInLiff() ? "normal" : "invisible";

      this.recaptchaVerifier = new RecaptchaVerifier(getPhoneAuth(), this.recaptchaContainerId, {
        size: recaptchaSize,
        callback: () => {
          if (isRunningInLiff()) {
            window.dispatchEvent(new CustomEvent("recaptcha-completed"));
          }
        },
        "expired-callback": () => {
          logger.debug("[PhoneAuthService] reCAPTCHA expired");
          this.clearRecaptcha();
        },
      });

      await this.recaptchaVerifier.render();

      const confirmationResult = await signInWithPhoneNumber(
        getPhoneAuth(),
        phoneNumber,
        this.recaptchaVerifier,
      );

      const verificationId = confirmationResult.verificationId;

      useAuthStore.getState().setPhoneAuth({ verificationId });

      return verificationId;
    } catch (error) {
      logFirebaseError(
        error,
        "[PhoneAuthService] Phone verification start failed",
        {
          phoneMasked: phoneNumber.replace(/\d(?=\d{4})/g, '*'),
          component: "PhoneAuthService",
        }
      );
      throw error;
    }
  }

  public async verifyPhoneCode(verificationCode: string): Promise<{
    success: boolean;
    phoneUid?: string;
    tokens?: { accessToken: string; refreshToken: string; expiresAt: string };
  }> {
    const phoneAuthState = useAuthStore.getState().phoneAuth;
    if (!phoneAuthState.verificationId) {
      logger.error("Missing verificationId", { component: "PhoneAuthService" });
      return { success: false };
    }

    try {
      // Server-side verification via /api/auth/phone-verify
      // Bypasses LIFF WebView restrictions that block client-side
      // communication with identitytoolkit.googleapis.com
      const res = await fetch("/api/auth/phone-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          verificationId: phoneAuthState.verificationId,
          verificationCode,
        }),
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        logger.warn("[PhoneAuthService] Server-side phone verification failed", {
          status: res.status,
          error: errorBody.error,
          component: "PhoneAuthService",
        });
        return { success: false };
      }

      const data = await res.json();

      return {
        success: true,
        phoneUid: data.phoneUid,
        tokens: {
          accessToken: data.idToken,
          refreshToken: data.refreshToken,
          expiresAt: data.expiresAt,
        },
      };
    } catch (error) {
      logger.warn("verifyPhoneCode failed", {
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
