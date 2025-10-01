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


  return (
    <div className="container mx-auto py-8">
      <PhoneVerificationForm />
    </div>
  );
}
