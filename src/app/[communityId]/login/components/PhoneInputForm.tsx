"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  isLoading: boolean;
  error: string | null;
  onSubmit: (phoneNumber: string) => void;
  onBack: () => void;
};

/**
 * PhoneInputForm is displayed when the user's LINE identity is not found (UserNotFound).
 * The user enters their phone number to search for an existing account to link.
 */
export function PhoneInputForm({ isLoading, error, onSubmit, onBack }: Props) {
  const t = useTranslations();
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.trim()) {
      onSubmit(phoneNumber.trim());
    }
  };

  const isValidPhoneNumber = phoneNumber.length >= 10;

  return (
    <div className="flex items-center justify-center p-12">
      <div className="w-full max-w-mobile-l">
        <div className="space-y-6 mb-10">
          <div className="text-heading-sm font-bold">
            {t("auth.phoneInput.title")}
          </div>
          <div className="text-body-md text-muted-foreground">
            {t("auth.phoneInput.description")}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone-number" className="text-label-md">
                {t("auth.phoneInput.phoneLabel")}
              </Label>
              <Input
                id="phone-number"
                type="tel"
                placeholder="09012345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={isLoading}
                className="h-12"
              />
            </div>

            {error && <div className="text-destructive text-sm">{error}</div>}

            <div className="flex flex-col gap-3 pt-4">
              <Button
                type="submit"
                disabled={isLoading || !isValidPhoneNumber}
                className="w-full h-12"
              >
                {isLoading ? t("auth.phoneInput.searching") : t("auth.phoneInput.submit")}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={onBack}
                disabled={isLoading}
                className="w-full h-12"
              >
                {t("auth.phoneInput.back")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
