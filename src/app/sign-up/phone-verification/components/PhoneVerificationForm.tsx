"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { VerificationStep } from "../types";
import { isValidPhoneNumber } from "../utils/validatePhoneNumber";
import { useResendTimer } from "../hooks/useResendTimer";
import { useRecaptchaManager } from "../hooks/useRecaptchaManager";
import { usePhoneSubmission } from "../hooks/usePhoneSubmission";
import { useCodeVerification } from "../hooks/useCodeVerification";
import { PhoneInputStep } from "./PhoneInputStep";
import { CodeVerificationStep } from "./CodeVerificationStep";
import { useAuthStore } from "@/lib/auth/core/auth-store";
import { useTranslations } from "next-intl";
import { useStartPhoneVerification } from "@/hooks/auth/actions/useStartPhoneVerification";
import { useVerifyPhoneCode } from "@/hooks/auth/actions/useVerifyPhoneCode";
import { useAuthDependencies } from "@/hooks/auth/init/useAuthDependencies";

export function PhoneVerificationForm() {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const nextParam = next ? `?next=${encodeURIComponent(next)}` : "";
  const { isAuthenticated, loading, updateAuthState } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>(undefined);
  const [verificationCode, setVerificationCode] = useState("");
  const [step, setStep] = useState<VerificationStep>("phone");

  const { phoneAuthService, authStateManager } = useAuthDependencies();
  const { phoneAuth } = useAuthStore.getState();
  const startPhoneVerification = useStartPhoneVerification(phoneAuthService);
  const verifyPhoneCode = useVerifyPhoneCode(phoneAuthService, authStateManager);
  const clearRecaptcha = phoneAuthService.clearRecaptcha;

  useEffect(() => {
    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    return () => {
      const y = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      window.scrollTo(0, parseInt(y || "0") * -1);
    };
  }, []);

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
  const codeVerification = useCodeVerification(
    {
      verifyPhoneCode,
    },
    nextParam,
    updateAuthState,
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

    const result = await codeVerification.verify(verificationCode);

    if (result.success) {
      if (result.message) {
        toast.success(result.message);
      }
      if (result.redirectPath) {
        router.push(result.redirectPath);
      }
    } else if (result.error) {
      toast.error(result.error.message);
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

  if (!isAuthenticated) {
    return null;
  }

  // If it breaks in production, revert phoneAuth.isVerifying and reCAPTCHA to the same positions as in master.

  return (
    <div className="w-full max-w-md mx-auto space-y-8">
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
          isVerifying={codeVerification.isVerifying}
          isPhoneVerifying={phoneAuth.isVerifying}
          isResendDisabled={isResendDisabled}
          countdown={countdown}
          isPhoneSubmitting={phoneSubmission.isSubmitting}
          showRecaptcha={recaptchaManager.showRecaptcha}
          recaptchaContainerRef={recaptchaManager.containerRef}
          phoneAuth={{ clearRecaptcha: clearRecaptcha }}
        />
      )}
    </div>
  );
}
