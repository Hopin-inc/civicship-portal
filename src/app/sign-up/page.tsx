"use client";

import { useAuth } from "@/contexts/AuthProvider";
import { SignUpForm } from "@/app/sign-up/components/SignUpForm";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { useEffect } from "react";
import { AuthRedirectService } from "@/lib/auth/auth-redirect-service";
import { decodeURIComponentWithType, EncodedURIComponent } from "@/utils/path";
import { useRouter, useSearchParams } from "next/navigation";

export default function RegisterAccount() {
  const { loading, authenticationState, isAuthenticating } = useAuth();
  const authRedirectService = AuthRedirectService.getInstance();

  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = decodeURIComponentWithType(
    (searchParams.get("next") ?? "/") as EncodedURIComponent | null,
  );

  useEffect(() => {
    if (loading || isAuthenticating) return;
    const isValidState = authenticationState === "phone_authenticated";

    if (!isValidState) {
      const redirectPath = authRedirectService.getPostLineAuthRedirectPath(nextPath);
      router.replace(redirectPath);
    }
  }, [authenticationState, isAuthenticating, loading, nextPath, router, authRedirectService]);

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
