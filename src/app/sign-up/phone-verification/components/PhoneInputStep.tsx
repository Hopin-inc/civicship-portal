"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PHONE_VERIFICATION_CONSTANTS } from "../utils/phoneVerificationConstants";

interface PhoneInputStepProps {
  phoneNumber: string;
  onPhoneNumberChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  isRateLimited: boolean;
  isPhoneValid: boolean;
  isVerifying: boolean;
  recaptchaContainerRef: React.RefObject<HTMLDivElement>;
}

export function PhoneInputStep({
  phoneNumber,
  onPhoneNumberChange,
  onSubmit,
  isSubmitting,
  isRateLimited,
  isPhoneValid,
  isVerifying,
  recaptchaContainerRef,
}: PhoneInputStepProps) {
  const [isReloading, setIsReloading] = useState(false);

  return (
    <>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">電話番号を入力</h1>
        <p className="text-sm text-muted-foreground">
          電話番号認証のため、あなたの電話番号を入力してください。SMSで認証コードが送信されます。
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium">
            電話番号
          </label>
          <input
            id="phone"
            type="tel"
            value={phoneNumber}
            onChange={(e) => onPhoneNumberChange(e.target.value)}
            placeholder="例）09012345678"
            className="w-full h-12 px-3 border rounded-md"
            required
          />
        </div>
        <div className="flex flex-col items-center gap-8 w-full mx-auto">
          <Button
            type="submit"
            className="w-full h-12 bg-primary text-white rounded-md"
            disabled={isSubmitting || isVerifying || !isPhoneValid || isReloading || isRateLimited}
          >
            {isSubmitting || isVerifying
              ? "送信中..."
              : isRateLimited
                ? "制限中..."
                : "認証コードを送信"}{" "}
          </Button>
          <Button
            type="button"
            className="px-4"
            size="sm"
            variant="text"
            disabled={isReloading}
            onClick={() => {
              setIsReloading(true);
              setTimeout(() => {
                window.location.reload();
              }, PHONE_VERIFICATION_CONSTANTS.RELOAD_INITIAL_DELAY_MS);
            }}
          >
            切り替わらない際は再読み込み
          </Button>
        </div>
      </form>
      <div id="recaptcha-container" ref={recaptchaContainerRef}></div>
    </>
  );
}
