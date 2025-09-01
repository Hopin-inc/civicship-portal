"use client";

import { useAuthStore } from "@/stores/auth-store";
import { SignUpForm } from "@/app/sign-up/components/SignUpForm";
import LoadingIndicator from "@/components/shared/LoadingIndicator";

export default function RegisterAccount() {
  const { isAuthenticating, authenticationState } = useAuthStore();
  const loading = isAuthenticating;

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
