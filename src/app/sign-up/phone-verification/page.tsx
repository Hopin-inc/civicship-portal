"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { PhoneVerificationForm } from "./PhoneVerificationForm";

export default function PhoneVerificationPage() {
  const router = useRouter();
  const hasRedirected = useRef(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || hasRedirected.current) return;

    const isLineWebBrowser = () => {
      if (typeof navigator === "undefined") return false;
      return /Line/i.test(navigator.userAgent);
    };

    if (isLineWebBrowser()) {
      hasRedirected.current = true;
      router.replace("/sign-up/phone-verification/line-browser");
    }
  }, [isClient, router]);

  return (
    <div className="container mx-auto py-8">
      <PhoneVerificationForm />
    </div>
  );
}
