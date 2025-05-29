"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import { SignUpForm } from "@/app/sign-up/components/SignUpForm";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { AuthRedirectService } from "@/lib/auth/auth-redirect-service";

export default function RegisterAccount() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next") ?? searchParams.get("liff.state");
  const authRedirectService = AuthRedirectService.getInstance();

  useEffect(() => {
    if (!loading && user) {
      const redirectPath = authRedirectService.getRedirectPath("/sign-up", nextParam);
      if (redirectPath) {
        router.replace(redirectPath);
      } else {
        router.replace(nextParam ?? "/users/me");
      }
    }
  }, [user, loading, router, nextParam, authRedirectService]);

  if (loading) {
    return <LoadingIndicator />;
  }
  if (!loading && user) return null;

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-md mx-auto">
        <SignUpForm />
      </div>
    </main>
  );
}
