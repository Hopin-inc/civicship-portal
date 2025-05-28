"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import { SignUpForm } from "@/app/sign-up/components/SignUpForm";
import LoadingIndicator from "@/components/shared/LoadingIndicator";

export default function RegisterAccount() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next");

  useEffect(() => {
    if (!loading && user) {
      router.replace(nextParam ?? "/users/me");
    }
  }, [user, loading, router]);

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
