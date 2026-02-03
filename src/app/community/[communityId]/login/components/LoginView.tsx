"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { AppLink } from "@/lib/navigation";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";

type Props = {
  isLoading: boolean;
  isAuthenticating: boolean;
  error: string | null;
  onLogin: (agreedTerms: boolean, agreedPrivacy: boolean) => void;
};

export function LoginView({ isLoading, isAuthenticating, error, onLogin }: Props) {
  const t = useTranslations();
  const communityConfig = useCommunityConfig();
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);

  return (
    <div className="flex items-center justify-center p-12">
      <div className="w-full max-w-mobile-l">
        <div className="space-y-3 mb-10">
          <div className="text-body-md mb-6">
            {t.rich("auth.login.welcomeMessage", {
              communityName: communityConfig?.title ?? "",
              b: (chunks) => <strong className="font-bold">{chunks}</strong>,
            })}
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-4">
              <Checkbox
                id="agree-terms"
                checked={agreedTerms}
                className="w-5 h-5"
                disabled={isLoading || isAuthenticating}
                onCheckedChange={(checked) => setAgreedTerms(!!checked)}
              />
              <Label htmlFor="agree-terms" className="text-label-md text-muted-foreground">
                <AppLink href="/terms" className="underline">
                  {t("auth.login.termsLabel")}
                </AppLink>
                <span className="text-label-sm">{t("auth.login.termsAgree")}</span>
              </Label>
            </div>

            <div className="flex items-center space-x-4">
              <Checkbox
                id="agree-privacy"
                checked={agreedPrivacy}
                className="w-5 h-5"
                disabled={isLoading || isAuthenticating}
                onCheckedChange={(checked) => setAgreedPrivacy(!!checked)}
              />
              <Label htmlFor="agree-privacy" className="text-label-md text-muted-foreground">
                <AppLink href="/privacy" className="underline">
                  {t("auth.login.privacyLabel")}
                </AppLink>
                <span className="text-label-sm">{t("auth.login.privacyAgree")}</span>
              </Label>
            </div>
          </div>
        </div>

        {error && <div className="text-destructive text-sm mt-2">{error}</div>}

        <Button
          onClick={() => onLogin(agreedTerms, agreedPrivacy)}
          disabled={isLoading || isAuthenticating}
          className="w-full bg-[#06C755] hover:bg-[#05B74B] text-white rounded-full h-14 flex items-center justify-center gap-2"
        >
          <Image src="/images/line-icon.png" alt="LINE" width={24} height={24} priority />
          {isLoading || isAuthenticating ? t("auth.login.loggingIn") : t("auth.login.loginButton")}
        </Button>
      </div>
    </div>
  );
}
