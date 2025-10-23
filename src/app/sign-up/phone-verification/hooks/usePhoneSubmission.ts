"use client";

import { useCallback, useRef, useState } from "react";
import { PhoneAuthService } from "@/lib/auth/service/phone-auth-service";
import { categorizeFirebaseError } from "@/lib/auth/core/firebase-config";
import { isRunningInLiff } from "@/lib/auth/core/environment-detector";
import { PHONE_VERIFICATION_CONSTANTS } from "../utils/phoneVerificationConstants";
import { useRecaptchaManager } from "./useRecaptchaManager";
import { useResendTimer } from "./useResendTimer";
import { logger } from "@/lib/logging";

interface PhoneSubmissionResult {
  success: boolean;
  error?: {
    message: string;
    type: string;
  };
}

export function usePhoneSubmission(
  phoneAuth: PhoneAuthService,
  recaptchaManager: ReturnType<typeof useRecaptchaManager>,
  resendTimer: Pick<ReturnType<typeof useResendTimer>, "isDisabled" | "start">
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);

  const isSubmittingRef = useRef(isSubmitting);
  const isRateLimitedRef = useRef(isRateLimited);

  isSubmittingRef.current = isSubmitting;
  isRateLimitedRef.current = isRateLimited;

  const handleSubmissionError = useCallback((error: unknown): PhoneSubmissionResult => {
    const categorized = categorizeFirebaseError(error);

    if (categorized.type === "rate-limit") {
      setIsRateLimited(true);
      setTimeout(
        () => setIsRateLimited(false),
        PHONE_VERIFICATION_CONSTANTS.RATE_LIMIT_DURATION_MS
      );
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
            message: "認証コード送信を準備中です",
            type: "not-ready",
          },
        };
      }

      if (isSubmittingRef.current || isRateLimitedRef.current) {
        return { success: false };
      }

      setIsSubmitting(true);

      try {
        await phoneAuth.startPhoneVerification(formattedPhone);
        resendTimer.start();
        return { success: true };
      } catch (error) {
        return handleSubmissionError(error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [phoneAuth, recaptchaManager, resendTimer, handleSubmissionError]
  );

  const resend = useCallback(
    async (formattedPhone: string): Promise<PhoneSubmissionResult> => {
      if (resendTimer.isDisabled || isSubmittingRef.current || isRateLimitedRef.current) {
        return { success: false };
      }

      if (!recaptchaManager.isReady) {
        return {
          success: false,
          error: {
            message: "認証コード送信を準備中です",
            type: "not-ready",
          },
        };
      }

      if (!formattedPhone) {
        return {
          success: false,
          error: {
            message: "電話番号が設定されていません。電話番号入力画面に戻ってください。",
            type: "invalid-phone",
          },
        };
      }

      recaptchaManager.show();
      setIsSubmitting(true);

      try {
        phoneAuth.clearRecaptcha?.();

        const waitTime = isRunningInLiff()
          ? PHONE_VERIFICATION_CONSTANTS.RECAPTCHA_WAIT_TIME_LIFF
          : PHONE_VERIFICATION_CONSTANTS.RECAPTCHA_WAIT_TIME_BROWSER;
        await new Promise((resolve) => setTimeout(resolve, waitTime));

        await phoneAuth.startPhoneVerification(formattedPhone);
        resendTimer.start();

        if (!isRunningInLiff()) {
          recaptchaManager.hide();
        }

        return { success: true };
      } catch (error) {
        logger.error("再送信エラー:", { error });
        return handleSubmissionError(error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [phoneAuth, recaptchaManager, resendTimer, handleSubmissionError]
  );

  return {
    submit,
    resend,
    isSubmitting,
    isRateLimited,
  };
}
