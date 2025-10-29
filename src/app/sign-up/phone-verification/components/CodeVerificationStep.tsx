"use client";

import React, { useMemo, useState } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { logger } from "@/lib/logging";
import { PHONE_VERIFICATION_CONSTANTS } from "../utils/phoneVerificationConstants";
import useHeaderConfig from "@/hooks/useHeaderConfig";

interface CodeVerificationStepProps {
  phoneNumber?: string;
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
  phoneAuth: { clearRecaptcha?: () => void };
}

export function CodeVerificationStep({
  phoneNumber,
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
  const headerConfig = useMemo(
    () => ({
      title: "認証コード検証",
      showBackButton: false,
      showLogo: false,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  const [isReloading, setIsReloading] = useState(false);

  const handleBackToPhone = async () => {
    try {
      phoneAuth.clearRecaptcha?.();
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
      <div>
        <p className="text-sm text-muted-foreground">
          {phoneNumber
            ? `${phoneNumber}に送信された6桁の認証コードを入力してください。`
            : "電話番号に送信された6桁の認証コードを入力してください。"}
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="flex justify-center py-4">
          <InputOTP maxLength={6} value={verificationCode} onChange={onCodeChange}>
            <InputOTPGroup>
              {Array.from({ length: 6 }).map((_, index) => (
                <InputOTPSlot key={index} index={index} />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>
        <div className="flex flex-col items-center gap-4 w-full mx-auto">
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
            {isVerifying ? "認証中..." : "認証する"}
          </Button>
          <Button
            type="button"
            variant="text"
            className="w-full h-10"
            disabled={
              isVerifying ||
              isPhoneVerifying ||
              isResendDisabled ||
              isPhoneSubmitting ||
              isReloading
            }
            onClick={onResend}
          >
            {isResendDisabled
              ? `${countdown}秒後に再送できます`
              : isPhoneSubmitting
                ? "送信中..."
                : "認証コードを再送"}
          </Button>
          <div
            id="recaptcha-container"
            ref={recaptchaContainerRef}
            style={{ display: showRecaptcha ? "block" : "none" }}
          ></div>
          <Button
            type="button"
            className="px-4"
            size="sm"
            variant={"text"}
            disabled={isVerifying || isPhoneVerifying || isPhoneSubmitting || isReloading}
            onClick={handleBackToPhone}
          >
            電話番号を変更する
          </Button>
        </div>
      </form>
    </>
  );
}
