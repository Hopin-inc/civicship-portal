"use client";

import React from "react";
import { AppLink, useAppRouter } from "@/lib/navigation";
import { ChevronLeft } from "lucide-react";
import { lineAuth as auth } from "@/lib/auth/core/firebase-config";
import { useCookies } from "next-client-cookies";
import { useTranslations } from "next-intl";

/**
 * Header component for the sign-up page with cancel functionality
 */
const SignUpHeader: React.FC = () => {
  const t = useTranslations();
  const router = useAppRouter();
  const cookies = useCookies();

  const handleCancel = async (e: React.MouseEvent) => {
    e.preventDefault();
    await auth.signOut();
    cookies.remove("access_token");
    router.push("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b max-w-mobile-l mx-auto w-full h-16 flex items-center px-4">
      <AppLink
        href="/public"
        onClick={handleCancel}
        className="absolute left-4 inline-flex items-center text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-5 w-5 mr-1" />
        {t("auth.signup.back")}
      </AppLink>
      <h1 className="flex-1 text-center text-lg font-bold truncate">{t("auth.signup.headerTitle")}</h1>
    </header>
  );
};

export default SignUpHeader;
