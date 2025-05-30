"use client";

import { useAuth } from "@/contexts/AuthProvider";
import { SignUpForm } from "@/app/sign-up/components/SignUpForm";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { useEffect } from "react";
import { AuthRedirectService } from "@/lib/auth/auth-redirect-service";
import { useRouter } from "next/navigation";

export default function RegisterAccount() {
  const authRedirectService = AuthRedirectService.getInstance();

  const { loading, authenticationState } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && authenticationState === "user_registered") {
      const currentPath = window.location.pathname + window.location.search;
      const redirectPath = authRedirectService.getRedirectPath(currentPath);

      if (redirectPath) {
        router.replace(redirectPath);
      }
    }
  }, [loading, router, authRedirectService, authenticationState]);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (authenticationState === "user_registered") {
    return <LoadingIndicator />;
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-md mx-auto">
        <SignUpForm />
      </div>
    </main>
  );
}
