"use client";

import { useAuth } from "@/contexts/AuthProvider";
import { SignUpForm } from "@/app/community/[communityId]/sign-up/components/SignUpForm";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { logger } from "@/lib/logging";

export default function RegisterAccount() {
  const { loading, authenticationState } = useAuth();

  if (loading) {
    logger.debug("[AUTH] RegisterAccount: loading", { component: "RegisterAccount" });
    return <LoadingIndicator />;
  }

  if (authenticationState === "user_registered") {
    logger.debug("[AUTH] RegisterAccount: user_registered, waiting for RouteGuard redirect", {
      authenticationState,
      component: "RegisterAccount",
    });
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
