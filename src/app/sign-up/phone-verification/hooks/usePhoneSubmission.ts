"use client";

import { useCallback, useEffect, useState } from "react";
import { categorizeFirebaseError } from "@/lib/auth/core/firebase-config";
import { isRunningInLiff } from "@/lib/auth/core/environment-detector";
import { PHONE_VERIFICATION_CONSTANTS } from "../utils/phoneVerificationConstants";
import { useRecaptchaManager } from "./useRecaptchaManager";
import { useResendTimer } from "./useResendTimer";
import { logger } from "@/lib/logging";
import { useAuthStore } from "@/lib/auth/core/auth-store";

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
  resendTimer: Pick<ReturnType<typeof useResendTimer>, "isDisabled" | "start">
) {
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
            message: "認証コード送信を準備中です",
            type: "not-ready",
          },
        };
      }

      if (isSubmitting || isRateLimited) {
        return {
          success: false,
          error: {
            message: isRateLimited
              ? "送信回数が上限に達しました。しばらく待ってから再試行してください。"
              : "送信処理中です。しばらくお待ちください。",
            type: isRateLimited ? "rate-limit" : "already-submitting",
          },
        };
      }

      useAuthStore.getState().setState({
        phoneAuth: {
          ...useAuthStore.getState().phoneAuth,
          verificationId: null,
        },
      });

      setIsSubmitting(true);

      try {
        const verificationId = await phoneAuth.startPhoneVerification(formattedPhone);
        
        const storedId = useAuthStore.getState().phoneAuth.verificationId;
        
        if (!verificationId || !storedId || storedId !== verificationId) {
          return {
            success: false,
            error: {
              message: "認証コードの送信に失敗しました。もう一度お試しください。",
              type: "verification-id-missing"
            }
          };
        }
        
        resendTimer.start();
        return { success: true };
      } catch (error) {
        return handleSubmissionError(error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [phoneAuth, recaptchaManager, resendTimer, handleSubmissionError, isSubmitting, isRateLimited]
  );

  const resend = useCallback(
    async (formattedPhone: string): Promise<PhoneSubmissionResult> => {
      if (resendTimer.isDisabled || isSubmitting || isRateLimited) {
        return {
          success: false,
          error: {
            message: isRateLimited
              ? "送信回数が上限に達しました。しばらく待ってから再試行してください。"
              : resendTimer.isDisabled
              ? "再送信は60秒後に可能です。"
              : "送信処理中です。しばらくお待ちください。",
            type: isRateLimited ? "rate-limit" : resendTimer.isDisabled ? "resend-disabled" : "already-submitting",
          },
        };
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

        useAuthStore.getState().setState({
          phoneAuth: {
            ...useAuthStore.getState().phoneAuth,
            verificationId: null,
          },
        });

        const waitTime = isRunningInLiff()
          ? PHONE_VERIFICATION_CONSTANTS.RECAPTCHA_WAIT_TIME_LIFF
          : PHONE_VERIFICATION_CONSTANTS.RECAPTCHA_WAIT_TIME_BROWSER;
        await new Promise((resolve) => setTimeout(resolve, waitTime));

        const verificationId = await phoneAuth.startPhoneVerification(formattedPhone);
        
        const storedId = useAuthStore.getState().phoneAuth.verificationId;
        
        if (!verificationId || !storedId || storedId !== verificationId) {
          return {
            success: false,
            error: {
              message: "認証コードの再送信に失敗しました。もう一度お試しください。",
              type: "verification-id-missing"
            }
          };
        }
        
        resendTimer.start();

        if (!isRunningInLiff()) {
          recaptchaManager.hide();
        }

        return { success: true, message: "認証コードを再送信しました" };
      } catch (error) {
        logger.error("再送信エラー:", { error });
        return handleSubmissionError(error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [phoneAuth, recaptchaManager, resendTimer, handleSubmissionError, isSubmitting, isRateLimited]
  );

  return {
    submit,
    resend,
    isSubmitting,
    isRateLimited,
  };
}
