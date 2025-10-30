"use client";

import { useCallback, useEffect, useState } from "react";
import { categorizeFirebaseError } from "@/lib/auth/core/firebase-config";
import { isRunningInLiff } from "@/lib/auth/core/environment-detector";
import { PHONE_VERIFICATION_CONSTANTS } from "../utils/phoneVerificationConstants";
import { useRecaptchaManager } from "./useRecaptchaManager";
import { useResendTimer } from "./useResendTimer";
import { logger } from "@/lib/logging";
import { useAuthStore } from "@/lib/auth/core/auth-store";
import { useTranslations } from "next-intl";

interface PhoneSubmissionResult {
  success: boolean;
  message?: string;
  error?: {
    message: string;
    type: string;
  };
}

export function usePhoneSubmission(
  phoneAuth: {
    startPhoneVerification: (phoneNumber: string) => Promise<string | null>;
    clearRecaptcha?: () => void;
  },
  recaptchaManager: ReturnType<typeof useRecaptchaManager>,
  resendTimer: Pick<ReturnType<typeof useResendTimer>, "isDisabled" | "start">,
) {
  const t = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);

  useEffect(() => {
    if (!isRateLimited) {
      return;
    }

    const timerId = setTimeout(() => {
      setIsRateLimited(false);
    }, PHONE_VERIFICATION_CONSTANTS.RATE_LIMIT_DURATION_MS);

    return () => clearTimeout(timerId);
  }, [isRateLimited]);

  const handleSubmissionError = useCallback((error: unknown): PhoneSubmissionResult => {
    const categorized = categorizeFirebaseError(error);

    if (categorized.type === "rate-limit") {
      setIsRateLimited(true);
    }

    return {
      success: false,
      error: {
        message: categorized.message,
        type: categorized.type,
      },
    };
  }, []);

  const submit = useCallback(
    async (formattedPhone: string): Promise<PhoneSubmissionResult> => {
      if (!recaptchaManager.isReady) {
        return {
          success: false,
          error: {
            message: t("phoneVerification.sending.prepare"),
            type: "not-ready",
          },
        };
      }

      if (isSubmitting || isRateLimited) {
        return {
          success: false,
          error: {
            message: isRateLimited
              ? t("phoneVerification.sending.rateLimited")
              : t("phoneVerification.sending.processing"),
            type: isRateLimited ? "rate-limit" : "already-submitting",
          },
        };
      }

      useAuthStore.getState().setPhoneAuth({ verificationId: null });
      setIsSubmitting(true);

      try {
        const verificationId = await phoneAuth.startPhoneVerification(formattedPhone);
        const storedId = useAuthStore.getState().phoneAuth.verificationId;

        if (!verificationId) {
          logger.error("Phone verification ID mismatch", {
            verificationIdReturned: !!verificationId,
            verificationIdStored: !!storedId,
          });
          return {
            success: false,
            error: {
              message: t("phoneVerification.sending.failed"),
              type: "verification-id-missing",
            },
          };
        }

        resendTimer.start();
        return { success: true };
      } catch (error) {
        logger.error("Phone verification submission failed", {
          errorCode: (error as any)?.code,
          errorMessage: (error as any)?.message,
        });
        return handleSubmissionError(error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [t, phoneAuth, recaptchaManager, resendTimer, handleSubmissionError, isSubmitting, isRateLimited],
  );

  const resend = useCallback(
    async (formattedPhone: string): Promise<PhoneSubmissionResult> => {
      if (resendTimer.isDisabled || isSubmitting || isRateLimited) {
        return {
          success: false,
          error: {
            message: isRateLimited
              ? t("phoneVerification.sending.rateLimited")
              : resendTimer.isDisabled
                ? t("phoneVerification.resend.cooldown", { seconds: 60 })
                : t("phoneVerification.sending.processing"),
            type: isRateLimited
              ? "rate-limit"
              : resendTimer.isDisabled
                ? "resend-disabled"
                : "already-submitting",
          },
        };
      }

      if (!recaptchaManager.isReady) {
        return {
          success: false,
          error: {
            message: t("phoneVerification.sending.prepare"),
            type: "not-ready",
          },
        };
      }

      if (!formattedPhone) {
        return {
          success: false,
          error: {
            message: t("phoneVerification.errors.phoneNotSetRestart"),
            type: "invalid-phone",
          },
        };
      }

      recaptchaManager.show();
      setIsSubmitting(true);

      try {
        phoneAuth.clearRecaptcha?.();
        useAuthStore.getState().setPhoneAuth({ verificationId: null });

        const waitTime = isRunningInLiff()
          ? PHONE_VERIFICATION_CONSTANTS.RECAPTCHA_WAIT_TIME_LIFF
          : PHONE_VERIFICATION_CONSTANTS.RECAPTCHA_WAIT_TIME_BROWSER;

        await new Promise((resolve) => setTimeout(resolve, waitTime));

        const verificationId = await phoneAuth.startPhoneVerification(formattedPhone);
        const storedId = useAuthStore.getState().phoneAuth.verificationId;

        if (!verificationId || !storedId || storedId !== verificationId) {
          logger.error("Phone verification ID mismatch on resend", {
            verificationIdReturned: !!verificationId,
            verificationIdStored: !!storedId,
          });
          return {
            success: false,
            error: {
              message: t("phoneVerification.resend.failed"),
              type: "verification-id-missing",
            },
          };
        }

        resendTimer.start();

        if (!isRunningInLiff()) {
          recaptchaManager.hide();
        }

        return { success: true, message: t("phoneVerification.resend.success") };
      } catch (error) {
        logger.error("Phone verification resend failed", {
          errorCode: (error as any)?.code,
          errorMessage: (error as any)?.message,
        });
        return handleSubmissionError(error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [t, phoneAuth, recaptchaManager, resendTimer, handleSubmissionError, isSubmitting, isRateLimited],
  );

  return {
    submit,
    resend,
    isSubmitting,
    isRateLimited,
  };
}
