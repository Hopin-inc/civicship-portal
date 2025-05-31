"use client";

import { useAuth } from "@/contexts/AuthProvider";
import { SignUpForm } from "@/app/sign-up/components/SignUpForm";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { useEffect } from "react";
import { AuthRedirectService } from "@/lib/auth/auth-redirect-service";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function RegisterAccount() {
  const authRedirectService = AuthRedirectService.getInstance();

  const { loading, authenticationState, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next");

  useEffect(() => {
    if (!loading && authenticationState === "user_registered" && user) {
      const redirectPath = authRedirectService.getRedirectPath(pathname, nextParam);

      if (redirectPath) {
        router.replace(redirectPath);
      }
    }
  }, [loading, router, authRedirectService, authenticationState, nextParam, user]);

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
