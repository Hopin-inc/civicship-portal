"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { PhoneVerificationForm } from "./PhoneVerificationForm";

export default function PhoneVerificationPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const hasRedirected = useRef(false);
  const [isClient, setIsClient] = useState(false); // client check

  useEffect(() => {
    setIsClient(true); // only runs on client
  }, []);

  useEffect(() => {
    if (!isClient || hasRedirected.current) return;

    if (loading) return;

    if (user) {
      hasRedirected.current = true;
      toast.success("既にログインしています");
      router.replace("/users/me");
      return;
    }

    if (/Line/i.test(navigator.userAgent)) {
      hasRedirected.current = true;
      router.replace("/sign-up/phone-verification/line-browser");
    }
  }, [isClient, loading, user, router]);

  if (!isClient || loading) {
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
