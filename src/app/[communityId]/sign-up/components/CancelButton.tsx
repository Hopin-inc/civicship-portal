"use client";

import { ChevronLeft } from "lucide-react";
import CommunityLink from "@/components/navigation/CommunityLink";
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
    <CommunityLink href="/public" onClick={cancel} className="inline-flex ul-link">
      <ChevronLeft />
      {t("auth.signup.backToTop")}
    </CommunityLink>
  );
};

export default CancelButton;
