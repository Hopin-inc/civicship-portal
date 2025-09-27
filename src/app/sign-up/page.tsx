"use client";

import { useAuth } from "@/contexts/AuthProvider";
import { useSearchParams } from "next/navigation";
import { SignUpForm } from "@/app/sign-up/components/SignUpForm";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { validateNextParam } from "@/lib/auth/next-param-utils";

export default function RegisterAccount() {
  const { loading, authenticationState } = useAuth();
  const searchParams = useSearchParams();
  const nextParam = validateNextParam(searchParams.get("next") || searchParams.get("liff.state"));

  if (loading) {
    return <LoadingIndicator />;
  }

  if (authenticationState === "user_registered") {
    return <LoadingIndicator />;
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-md mx-auto">
        <SignUpForm nextPath={nextParam} />
      </div>
    </main>
  );
}
