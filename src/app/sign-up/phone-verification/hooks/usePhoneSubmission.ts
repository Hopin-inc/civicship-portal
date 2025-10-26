"use client";

import { useCallback, useEffect, useState } from "react";
import { categorizeFirebaseError } from "@/lib/auth/core/firebase-config";
import { isRunningInLiff } from "@/lib/auth/core/environment-detector";
import { PHONE_VERIFICATION_CONSTANTS } from "../utils/phoneVerificationConstants";
import { useRecaptchaManager } from "./useRecaptchaManager";
import { useResendTimer } from "./useResendTimer";
import { logger } from "@/lib/logging";
import { useAuthStore } from "@/lib/auth/core/auth-store";
import { AuthFlowLogger, maskPhoneNumber } from "@/lib/logging/client/utils";

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
  authLogger?: AuthFlowLogger
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
      authLogger?.info("phone/submit_start", {
        phoneNumber: maskPhoneNumber(formattedPhone),
        recaptchaReady: recaptchaManager.isReady,
        isSubmitting,
        isRateLimited,
      });

      if (!recaptchaManager.isReady) {
        authLogger?.warn("phone/submit_blocked", {
          reason: "recaptcha_not_ready",
        });
        return {
          success: false,
          error: {
            message: "認証コード送信を準備中です",
            type: "not-ready",
          },
        };
      }

      if (isSubmitting || isRateLimited) {
        authLogger?.warn("phone/submit_blocked", {
          reason: isRateLimited ? "rate_limited" : "already_submitting",
        });
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

      authLogger?.info("phone/clear_verification_id", {
        action: "clearing_stale_verification_id",
      });

      useAuthStore.getState().setState({
        phoneAuth: {
          ...useAuthStore.getState().phoneAuth,
          verificationId: null,
        },
      });

      setIsSubmitting(true);

      try {
        authLogger?.info("phone/start_verification_call", {
          phoneNumber: maskPhoneNumber(formattedPhone),
        });

        const verificationId = await phoneAuth.startPhoneVerification(formattedPhone);
        
        const storedId = useAuthStore.getState().phoneAuth.verificationId;
        
        authLogger?.info("phone/verification_result", {
          verificationIdReturned: !!verificationId,
          verificationIdStored: !!storedId,
          idsMatch: verificationId === storedId,
          verificationIdSuffix: verificationId ? verificationId.slice(-6) : null,
          storedIdSuffix: storedId ? storedId.slice(-6) : null,
        });
        
        if (!verificationId || !storedId || storedId !== verificationId) {
          authLogger?.error("phone/verification_id_mismatch", {
            verificationIdReturned: !!verificationId,
            verificationIdStored: !!storedId,
            idsMatch: verificationId === storedId,
          });
          return {
            success: false,
            error: {
              message: "認証コードの送信に失敗しました。もう一度お試しください。",
              type: "verification-id-missing"
            }
          };
        }
        
        authLogger?.info("phone/submit_success", {
          verificationIdSuffix: verificationId.slice(-6),
        });

        resendTimer.start();
        return { success: true };
      } catch (error) {
        authLogger?.error("phone/submit_error", {
          errorCode: (error as any)?.code,
          errorMessage: (error as any)?.message,
        });
        return handleSubmissionError(error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [phoneAuth, recaptchaManager, resendTimer, handleSubmissionError, isSubmitting, isRateLimited, authLogger]
  );

  const resend = useCallback(
    async (formattedPhone: string): Promise<PhoneSubmissionResult> => {
      authLogger?.info("phone/resend_start", {
        phoneNumber: maskPhoneNumber(formattedPhone),
        resendDisabled: resendTimer.isDisabled,
        isSubmitting,
        isRateLimited,
      });

      if (resendTimer.isDisabled || isSubmitting || isRateLimited) {
        authLogger?.warn("phone/resend_blocked", {
          reason: isRateLimited ? "rate_limited" : resendTimer.isDisabled ? "resend_disabled" : "already_submitting",
        });
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
        authLogger?.warn("phone/resend_blocked", {
          reason: "recaptcha_not_ready",
        });
        return {
          success: false,
          error: {
            message: "認証コード送信を準備中です",
            type: "not-ready",
          },
        };
      }

      if (!formattedPhone) {
        authLogger?.error("phone/resend_error", {
          reason: "phone_number_missing",
        });
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
        authLogger?.info("phone/resend_clear_recaptcha", {
          action: "clearing_recaptcha_and_verification_id",
        });

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

        authLogger?.info("phone/resend_wait", {
          waitTimeMs: waitTime,
          isLiff: isRunningInLiff(),
        });

        await new Promise((resolve) => setTimeout(resolve, waitTime));

        authLogger?.info("phone/resend_verification_call", {
          phoneNumber: maskPhoneNumber(formattedPhone),
        });

        const verificationId = await phoneAuth.startPhoneVerification(formattedPhone);
        
        const storedId = useAuthStore.getState().phoneAuth.verificationId;
        
        authLogger?.info("phone/resend_verification_result", {
          verificationIdReturned: !!verificationId,
          verificationIdStored: !!storedId,
          idsMatch: verificationId === storedId,
          verificationIdSuffix: verificationId ? verificationId.slice(-6) : null,
          storedIdSuffix: storedId ? storedId.slice(-6) : null,
        });
        
        if (!verificationId || !storedId || storedId !== verificationId) {
          authLogger?.error("phone/resend_verification_id_mismatch", {
            verificationIdReturned: !!verificationId,
            verificationIdStored: !!storedId,
            idsMatch: verificationId === storedId,
          });
          return {
            success: false,
            error: {
              message: "認証コードの再送信に失敗しました。もう一度お試しください。",
              type: "verification-id-missing"
            }
          };
        }
        
        authLogger?.info("phone/resend_success", {
          verificationIdSuffix: verificationId.slice(-6),
        });

        resendTimer.start();

        if (!isRunningInLiff()) {
          recaptchaManager.hide();
        }

        return { success: true, message: "認証コードを再送信しました" };
      } catch (error) {
        authLogger?.error("phone/resend_error", {
          errorCode: (error as any)?.code,
          errorMessage: (error as any)?.message,
        });
        logger.error("再送信エラー:", { error });
        return handleSubmissionError(error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [phoneAuth, recaptchaManager, resendTimer, handleSubmissionError, isSubmitting, isRateLimited, authLogger]
  );

  return {
    submit,
    resend,
    isSubmitting,
    isRateLimited,
  };
}
