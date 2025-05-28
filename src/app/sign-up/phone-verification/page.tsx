"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { PhoneVerificationForm } from "./PhoneVerificationForm";

export default function PhoneVerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (hasRedirected.current) return;

    const isLineWebBrowser = () => {
      if (typeof navigator === "undefined") return false;
      const userAgent = navigator.userAgent;
      return /Line/i.test(userAgent);
    };

    if (isLineWebBrowser()) {
      hasRedirected.current = true;
      const nextParam = searchParams.get("next") ?? searchParams.get("liff.state");
      const redirectUrl = nextParam
        ? `/sign-up/phone-verification/line-browser?next=${encodeURIComponent(nextParam)}`
        : "/sign-up/phone-verification/line-browser";
      window.location.replace(redirectUrl);
    }
  }, [router]);

  return (
    <div className="container mx-auto py-8">
      <PhoneVerificationForm />
    </div>
  );
}
