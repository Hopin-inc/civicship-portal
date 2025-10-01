"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { PhoneVerificationForm } from "./components/PhoneVerificationForm";
import { AuthEnvironment, detectEnvironment } from "@/lib/auth/environment-detector";
import useHeaderConfig from "@/hooks/useHeaderConfig";

export default function PhoneVerificationPage() {
  const router = useRouter();
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

  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next") ?? searchParams.get("liff.state");

  useEffect(() => {
    if (hasRedirected.current) return;
    const env = detectEnvironment();

    if (env === AuthEnvironment.LIFF_WITH_SDK) {
      hasRedirected.current = true;
      const redirectUrl = nextParam
        ? `/sign-up/phone-verification/line-browser?next=${nextParam}`
        : "/sign-up/phone-verification/line-browser";
      router.replace(redirectUrl);
    }
  }, [nextParam, router]);

  return (
    <div className="container mx-auto py-8">
      <PhoneVerificationForm />
    </div>
  );
}
