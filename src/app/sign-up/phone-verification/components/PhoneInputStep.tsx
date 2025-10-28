"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DEFAULT_COUNTRY,
  PHONE_VERIFICATION_CONSTANTS,
  SHOW_FLAGS,
} from "../utils/phoneVerificationConstants";
import { InternationalPhoneField } from "./InternationalPhoneField";
import useHeaderConfig from "@/hooks/useHeaderConfig";

interface PhoneInputStepProps {
  phoneNumber: string | undefined;
  onPhoneNumberChange: (value: string | undefined) => void;
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
  const headerConfig = useMemo(
    () => ({
      title: "電話番号認証",
      showBackButton: false,
      showLogo: false,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  const [isReloading, setIsReloading] = useState(false);

  return (
    <>
      <div>
        <p className="text-sm text-muted-foreground">
          電話番号認証のため、あなたの電話番号を入力してください。SMSで認証コードが送信されます。
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <InternationalPhoneField
          id="phone"
          value={phoneNumber}
          onChange={onPhoneNumberChange}
          defaultCountry={DEFAULT_COUNTRY}
          showFlags={SHOW_FLAGS}
          placeholder="例）09012345678"
          disabled={isSubmitting || isVerifying || isReloading}
        />
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
            disabled={isSubmitting || isVerifying || isReloading}
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
