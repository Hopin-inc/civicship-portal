"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { PhoneVerificationForm } from "./PhoneVerificationForm";

export default function PhoneVerificationPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const hasRedirected = useRef(false); // ✅ リダイレクト済みフラグ

  const isLineWebBrowser = () => {
    if (typeof window === "undefined") return false;
    return /Line/i.test(navigator.userAgent);
  };

  useEffect(() => {
    if (hasRedirected.current) return; // ✅ すでにリダイレクト済みならスキップ

    if (loading) return; // 認証状態が未確定な間は待つ

    if (user) {
      hasRedirected.current = true; // ✅ フラグ更新
      toast.success("既にログインしています");
      router.replace("/users/me");
      return;
    }

    if (isLineWebBrowser()) {
      hasRedirected.current = true; // ✅ フラグ更新
      router.replace("/sign-up/phone-verification/line-browser");
    }
  }, [loading, user, router]);

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
