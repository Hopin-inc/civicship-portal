"use client";

import { useAuth } from "@/contexts/AuthProvider";
import { SignUpForm } from "@/app/sign-up/components/SignUpForm";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { useEffect } from "react";
import { AuthRedirectService } from "@/lib/auth/auth-redirect-service";

export default function RegisterAccount() {
  const authRedirectService = AuthRedirectService.getInstance();

  const { user: currentUser, loading } = useAuth();

  useEffect(() => {
    if (!loading && currentUser) {
      const currentPath =
        typeof window !== "undefined" ? window.location.pathname + window.location.search : "/";
      const redirectPath = authRedirectService.getPostLineAuthRedirectPath(currentPath);
      console.log("[Debug] Redirecting existing user from /sign-up to:", redirectPath);
    }
  }, [loading, currentUser, authRedirectService]);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (currentUser) {
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
