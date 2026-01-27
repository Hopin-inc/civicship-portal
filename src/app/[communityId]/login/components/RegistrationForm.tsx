"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  isLoading: boolean;
  error: string | null;
  phoneNumber: string;
  lineUid: string;
  onSubmit: (data: RegistrationData) => void;
  onBack: () => void;
};

export type RegistrationData = {
  name: string;
  phoneNumber: string;
  lineUid: string;
};

/**
 * RegistrationForm is displayed when the user needs to create a new account (UserRegistrationRequired).
 * The user enters their profile information to complete registration.
 */
export function RegistrationForm({ isLoading, error, phoneNumber, lineUid, onSubmit, onBack }: Props) {
  const t = useTranslations();
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit({
        name: name.trim(),
        phoneNumber,
        lineUid,
      });
    }
  };

  const isValidForm = name.trim().length > 0;

  return (
    <div className="flex items-center justify-center p-12">
      <div className="w-full max-w-mobile-l">
        <div className="space-y-6 mb-10">
          <div className="text-heading-sm font-bold">
            {t("auth.registration.title")}
          </div>
          <div className="text-body-md text-muted-foreground">
            {t("auth.registration.description")}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-label-md">
                {t("auth.registration.nameLabel")}
              </Label>
              <Input
                id="name"
                type="text"
                placeholder={t("auth.registration.namePlaceholder")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone-display" className="text-label-md">
                {t("auth.registration.phoneLabel")}
              </Label>
              <Input
                id="phone-display"
                type="tel"
                value={phoneNumber}
                disabled
                className="h-12 bg-muted"
              />
              <p className="text-sm text-muted-foreground">
                {t("auth.registration.phoneNote")}
              </p>
            </div>

            {error && <div className="text-destructive text-sm">{error}</div>}

            <div className="flex flex-col gap-3 pt-4">
              <Button
                type="submit"
                disabled={isLoading || !isValidForm}
                className="w-full h-12"
              >
                {isLoading ? t("auth.registration.registering") : t("auth.registration.submit")}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={onBack}
                disabled={isLoading}
                className="w-full h-12"
              >
                {t("auth.registration.back")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
