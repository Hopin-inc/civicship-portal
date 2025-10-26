"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { VerificationStep } from "../types";
import { validatePhoneNumber } from "../utils/validation";
import { useResendTimer } from "../hooks/useResendTimer";
import { useRecaptchaManager } from "../hooks/useRecaptchaManager";
import { usePhoneSubmission } from "../hooks/usePhoneSubmission";
import { useCodeVerification } from "../hooks/useCodeVerification";
import { PhoneInputStep } from "./PhoneInputStep";
import { CodeVerificationStep } from "./CodeVerificationStep";

export function PhoneVerificationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const nextParam = next ? `?next=${encodeURIComponent(next)}` : "";
  const { phoneAuth, isAuthenticated, loading, updateAuthState } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [step, setStep] = useState<VerificationStep>("phone");

  const { isDisabled: isResendDisabled, countdown, start: startResendTimer } = useResendTimer();
  const recaptchaManager = useRecaptchaManager();
  const phoneSubmission = usePhoneSubmission(phoneAuth, recaptchaManager, {
    isDisabled: isResendDisabled,
    start: startResendTimer,
  });
  const codeVerification = useCodeVerification(phoneAuth, nextParam, updateAuthState);

  const { isValid: isPhoneValid, formattedPhone } = validatePhoneNumber(phoneNumber);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPhoneValid) {
      toast.error("有効な電話番号を入力してください");
      return;
    }

    const result = await phoneSubmission.submit(formattedPhone);

    if (result.success) {
      setStep("code");
    } else if (result.error) {
      toast.error(result.error.message);
    }
  };

  const handleResendCode = async () => {
    const result = await phoneSubmission.resend(formattedPhone);

    if (result.success) {
      if (result.message) {
        toast.success(result.message);
      }
    } else if (result.error) {
      toast.error(result.error.message);
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
    setPhoneNumber("");
    setVerificationCode("");
    setStep("phone");
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
          phoneAuth={{ clearRecaptcha: phoneAuth.clearRecaptcha }}
        />
      )}
    </div>
  );
}
