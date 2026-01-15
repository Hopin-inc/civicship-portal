"use client";

import { useSearchParams } from "next/navigation";
import { useCommunityRouter } from "@/hooks/useCommunityRouter";
import { useEffect, useRef } from "react";
import { PhoneVerificationForm } from "./components/PhoneVerificationForm";
import { useAuthEnvironment } from "@/hooks/useAuthEnvironment";

export default function PhoneVerificationPage() {
  const router = useCommunityRouter();
  const hasRedirected = useRef(false);
  const { isLineBrowser } = useAuthEnvironment();

  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next") ?? searchParams.get("liff.state");

  useEffect(() => {
    if (hasRedirected.current) return;

    if (isLineBrowser) {
      hasRedirected.current = true;
      const redirectUrl = nextParam
        ? `/sign-up/phone-verification/line-browser?next=${nextParam}`
        : "/sign-up/phone-verification/line-browser";
      router.replace(redirectUrl);
    }
  }, [nextParam, router, isLineBrowser]);

  return (
    <div className="container mx-auto py-8">
      <PhoneVerificationForm />
    </div>
  );
}
