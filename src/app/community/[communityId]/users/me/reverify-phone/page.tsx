"use client";

import { useEffect } from "react";
import { useAppRouter } from "@/lib/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ReverifyPhoneForm } from "./components/ReverifyPhoneForm";

export default function ReverifyPhonePage() {
  const router = useAppRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login?next=/users/me/reverify-phone");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return <LoadingIndicator fullScreen />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <ReverifyPhoneForm />;
}
