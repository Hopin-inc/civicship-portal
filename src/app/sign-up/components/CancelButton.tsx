"use client";

import { ChevronLeft } from "lucide-react";
import { AppLink } from "@/lib/navigation";
import { lineAuth as auth } from "@/lib/auth/core/firebase-config";
import { useCookies } from "next-client-cookies";
import { useRouter } from "next/navigation";
import { MouseEventHandler } from "react";
import { useTranslations } from "next-intl";

const CancelButton: React.FC = () => {
  const t = useTranslations();
  const router = useRouter();
  const cookies = useCookies();

  const cancel: MouseEventHandler = async (e) => {
    e.preventDefault();
    await auth.signOut();
    cookies.remove("access_token");
    router.push("/");
  };

  return (
    <AppLink href="/public" onClick={cancel} className="inline-flex ul-link">
      <ChevronLeft />
      {t("auth.signup.backToTop")}
    </AppLink>
  );
};

export default CancelButton;
