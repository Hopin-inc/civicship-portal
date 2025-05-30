"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { PhoneVerificationForm } from "./components/PhoneVerificationForm";
import { AuthEnvironment, detectEnvironment } from "@/lib/auth/environment-detector";
import useHeaderConfig from "@/hooks/useHeaderConfig";

export default function PhoneVerificationPage() {
  const searchParams = useSearchParams();
  const hasRedirected = useRef(false);

  const headerConfig = useMemo(
    () => ({
      title: "電話番号認証",
      showBackButton: false,
      showLogo: false,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  useEffect(() => {
    if (hasRedirected.current) return;

    const env = detectEnvironment();

    if (env === AuthEnvironment.LINE_BROWSER) {
      hasRedirected.current = true;
      const nextParam = searchParams.get("next") ?? searchParams.get("liff.state");
      const redirectUrl = nextParam
        ? `/sign-up/phone-verification/line-browser?next=${nextParam}`
        : "/sign-up/phone-verification/line-browser";
      window.location.replace(redirectUrl);
    }
  }, [searchParams]);

  return (
    <div className="container mx-auto py-8">
      <PhoneVerificationForm />
    </div>
  );
}
