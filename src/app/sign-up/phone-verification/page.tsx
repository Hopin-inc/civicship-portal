"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { PhoneVerificationForm } from "./PhoneVerificationForm";

export default function PhoneVerificationPage() {
  const router = useRouter();
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
      window.location.replace("/sign-up/phone-verification/line-browser");
    }
  }, [router]);

  return (
    <div className="container mx-auto py-8">
      <PhoneVerificationForm />
    </div>
  );
}
