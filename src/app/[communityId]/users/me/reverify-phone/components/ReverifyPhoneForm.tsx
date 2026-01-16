"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { toast } from "react-toastify";
import { useCommunityRouter } from "@/hooks/useCommunityRouter";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { isValidPhoneNumber } from "@/app/[communityId]/sign-up/phone-verification/utils/validatePhoneNumber";
import { useResendTimer } from "@/app/[communityId]/sign-up/phone-verification/hooks/useResendTimer";
import { useRecaptchaManager } from "@/app/[communityId]/sign-up/phone-verification/hooks/useRecaptchaManager";
import { usePhoneSubmission } from "@/app/[communityId]/sign-up/phone-verification/hooks/usePhoneSubmission";
import { PhoneInputStep } from "@/app/[communityId]/sign-up/phone-verification/components/PhoneInputStep";
import { CodeVerificationStep } from "@/app/[communityId]/sign-up/phone-verification/components/CodeVerificationStep";
import { useAuthStore } from "@/lib/auth/core/auth-store";
import { useTranslations } from "next-intl";
import { useStartPhoneVerification } from "@/hooks/auth/actions/useStartPhoneVerification";
import { useVerifyPhoneCode } from "@/hooks/auth/actions/useVerifyPhoneCode";
import { useAuthDependencies } from "@/hooks/auth/init/useAuthDependencies";
import { useStorePhoneAuthToken } from "@/hooks/auth/actions/useStorePhoneAuthToken";
import { logger } from "@/lib/logging";

type VerificationStep = "phone" | "code";

export function ReverifyPhoneForm() {
  const t = useTranslations();
  const router = useCommunityRouter();
  const { loading, user } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>(undefined);
  const [verificationCode, setVerificationCode] = useState("");
  const [step, setStep] = useState<VerificationStep>("phone");
  const [isVerifying, setIsVerifying] = useState(false);

  const { phoneAuthService, authStateManager } = useAuthDependencies();
  const { phoneAuth } = useAuthStore.getState();
  const startPhoneVerification = useStartPhoneVerification(phoneAuthService);
  const verifyPhoneCode = useVerifyPhoneCode(phoneAuthService, authStateManager);
  const clearRecaptcha = phoneAuthService.clearRecaptcha;
  const { storeTokens, loading: isStoringTokens } = useStorePhoneAuthToken(user?.id);

  const { isDisabled: isResendDisabled, countdown, start: startResendTimer } = useResendTimer();
  const recaptchaManager = useRecaptchaManager();
  const phoneSubmission = usePhoneSubmission(
    {
      startPhoneVerification,
      clearRecaptcha,
    },
    recaptchaManager,
    {
      isDisabled: isResendDisabled,
      start: startResendTimer,
    },
  );

  const isPhoneValid = isValidPhoneNumber(phoneNumber);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPhoneValid || !phoneNumber) {
      toast.error(t("phoneVerification.errors.invalidPhone"));
      return;
    }

    const result = await phoneSubmission.submit(phoneNumber);

    if (result.success) {
      setStep("code");
    } else if (result.error) {
      const errorMessage = result.error.messageKey
        ? t(result.error.messageKey)
        : result.error.message;
      toast.error(errorMessage);
    }
  };

  const handleResendCode = async () => {
    if (!phoneNumber) {
      toast.error(t("phoneVerification.errors.phoneNotSet"));
      return;
    }

    const result = await phoneSubmission.resend(phoneNumber);

    if (result.success) {
      if (result.message) {
        toast.success(result.message);
      }
    } else if (result.error) {
      const errorMessage = result.error.messageKey
        ? t(result.error.messageKey)
        : result.error.message;
      toast.error(errorMessage);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    try {
      const success = await verifyPhoneCode(verificationCode);

      if (!success) {
        toast.error(t("phoneVerification.verification.invalidCode"));
        return;
      }

      // Store tokens to DB after successful phone verification
      const storeResult = await storeTokens();

      if (storeResult.success) {
        logger.debug("[ReverifyPhoneForm] Phone auth token stored successfully");
        toast.success(t("phoneVerification.verification.completed"));
        router.push("/users/me");
      } else {
        logger.warn("[ReverifyPhoneForm] Failed to store phone auth token");
        toast.error(t("phoneVerification.errors.generic"));
      }
    } catch (error) {
      logger.error("[ReverifyPhoneForm] Error during code verification", {
        error: error instanceof Error ? error.message : String(error),
      });
      toast.error(t("phoneVerification.errors.generic"));
    } finally {
      setIsVerifying(false);
    }
  };

  const handleOTPChange = (value: string) => {
    setVerificationCode(value);
  };

  const handleBackToPhone = () => {
    setPhoneNumber(undefined);
    setVerificationCode("");
    setStep("phone");

    const { setPhoneAuth } = useAuthStore.getState();
    setPhoneAuth({ verificationId: null });
  };

  if (loading) {
    return <LoadingIndicator fullScreen={true} />;
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-8 px-4 py-8">
      {step === "phone" && (
        <PhoneInputStep
          phoneNumber={phoneNumber}
          onPhoneNumberChange={setPhoneNumber}
          onSubmit={handlePhoneSubmit}
          isSubmitting={phoneSubmission.isSubmitting}
          isRateLimited={phoneSubmission.isRateLimited}
          isPhoneValid={isPhoneValid}
          isVerifying={phoneAuth.isVerifying}
          recaptchaContainerRef={recaptchaManager.containerRef}
        />
      )}

      {step === "code" && (
        <CodeVerificationStep
          phoneNumber={phoneNumber}
          verificationCode={verificationCode}
          onCodeChange={handleOTPChange}
          onSubmit={handleCodeSubmit}
          onResend={handleResendCode}
          onBackToPhone={handleBackToPhone}
          isVerifying={isVerifying || isStoringTokens}
          isPhoneVerifying={phoneAuth.isVerifying}
          isResendDisabled={isResendDisabled}
          countdown={countdown}
          isPhoneSubmitting={phoneSubmission.isSubmitting}
          showRecaptcha={recaptchaManager.showRecaptcha}
          recaptchaContainerRef={recaptchaManager.containerRef}
          phoneAuth={{ clearRecaptcha }}
        />
      )}
    </div>
  );
}
