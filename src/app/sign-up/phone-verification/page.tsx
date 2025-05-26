"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { PhoneVerificationForm } from "./PhoneVerificationForm";
import { isRunningInLiff } from "@/utils/liff";

export default function PhoneVerificationPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const isLineWebBrowser = () => {
    if (typeof window === "undefined") return false;
    return /Line/i.test(navigator.userAgent);
  };

  useEffect(() => {
    const isLiff = isRunningInLiff();

    if (!isLiff && isLineWebBrowser()) {
      router.replace("/sign-up/phone-verification/line-browser");
      return;
    }

    if (!loading && user) {
      toast.success("既にログインしています");
      router.replace("/users/me");
    }
  }, [router, user, loading]);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (!loading && user) {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <PhoneVerificationForm />
    </div>
  );
}
