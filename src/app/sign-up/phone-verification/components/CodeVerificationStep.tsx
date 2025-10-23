"use client";

import React, { useState } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { logger } from "@/lib/logging";
import { PHONE_VERIFICATION_CONSTANTS } from "../utils/phoneVerificationConstants";
import { PhoneAuthService } from "@/lib/auth/service/phone-auth-service";

interface CodeVerificationStepProps {
  verificationCode: string;
  onCodeChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onResend: () => void;
  onBackToPhone: () => void;
  isVerifying: boolean;
  isPhoneVerifying: boolean;
  isResendDisabled: boolean;
  countdown: number;
  isPhoneSubmitting: boolean;
  showRecaptcha: boolean;
  recaptchaContainerRef: React.RefObject<HTMLDivElement>;
  phoneAuth: PhoneAuthService;
}

export function CodeVerificationStep({
  verificationCode,
  onCodeChange,
  onSubmit,
  onResend,
  onBackToPhone,
  isVerifying,
  isPhoneVerifying,
  isResendDisabled,
  countdown,
  isPhoneSubmitting,
  showRecaptcha,
  recaptchaContainerRef,
  phoneAuth,
}: CodeVerificationStepProps) {
  const [isReloading, setIsReloading] = useState(false);

  const handleBackToPhone = async () => {
    try {
      if (phoneAuth.clearRecaptcha) {
        await phoneAuth.clearRecaptcha();
      }
    } catch (error) {
      logger.error("reCAPTCHAクリアエラー:", { error });
    } finally {
      setIsReloading(true);
      onBackToPhone();
      setTimeout(() => {
        window.location.reload();
      }, PHONE_VERIFICATION_CONSTANTS.RELOAD_DELAY_MS);
    }
  };

  return (
    <>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">認証コードを入力</h1>
        <p className="text-sm text-muted-foreground">
          電話番号に送信された6桁の認証コードを入力してください。
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="code" className="text-sm font-medium">
            認証コード
          </label>
          <div className="flex justify-center py-4">
            <InputOTP maxLength={6} value={verificationCode} onChange={onCodeChange}>
              <InputOTPGroup>
                {Array.from({ length: 6 }).map((_, index) => (
                  <InputOTPSlot key={index} index={index} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
        </div>
        <div className="flex flex-col items-center gap-8 w-full mx-auto">
          <Button
            type="submit"
            className="w-full h-12"
            disabled={
              isVerifying ||
              isPhoneVerifying ||
              verificationCode.length < PHONE_VERIFICATION_CONSTANTS.VERIFICATION_CODE_LENGTH ||
              isReloading
            }
          >
            {isVerifying ? "検証中..." : "コードを検証"}
          </Button>
          <Button
            type="button"
            variant="tertiary"
            className="w-full h-12"
            disabled={isResendDisabled || isPhoneSubmitting || isReloading}
            onClick={onResend}
          >
            {isResendDisabled
              ? `${countdown}秒後に再送信できます`
              : isPhoneSubmitting
                ? "送信中..."
                : "コードを再送信"}
          </Button>
          <div
            id="recaptcha-container"
            ref={recaptchaContainerRef}
            style={{ display: showRecaptcha ? "block" : "none" }}
          ></div>
          <Button type="button" variant={"text"} disabled={isReloading} onClick={handleBackToPhone}>
            電話番号を再入力
          </Button>
        </div>
      </form>
    </>
  );
}
