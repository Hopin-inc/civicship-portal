"use client";

import React, { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("PhoneInputStep");
  const headerConfig = useMemo(
    () => ({
      title: t("headerTitle"),
      showBackButton: false,
      showLogo: false,
    }),
    [t],
  );
  useHeaderConfig(headerConfig);

  const [isReloading, setIsReloading] = useState(false);

  return (
    <>
      <div>
        <p className="text-sm text-muted-foreground">
          {t("description")}
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <InternationalPhoneField
          id="phone"
          value={phoneNumber}
          onChange={onPhoneNumberChange}
          defaultCountry={DEFAULT_COUNTRY}
          showFlags={SHOW_FLAGS}
          placeholder={t("placeholder")}
          disabled={isSubmitting || isVerifying || isReloading}
        />
        <div className="flex flex-col items-center gap-8 w-full mx-auto">
          <Button
            type="submit"
            className="w-full h-12 bg-primary text-white rounded-md"
            disabled={isSubmitting || isVerifying || !isPhoneValid || isReloading || isRateLimited}
          >
            {isSubmitting || isVerifying
              ? t("sending")
              : isRateLimited
                ? t("rateLimited")
                : t("sendButton")}{" "}
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
            {t("reloadButton")}
          </Button>
        </div>
      </form>
      <div id="recaptcha-container" ref={recaptchaContainerRef}></div>
    </>
  );
}
