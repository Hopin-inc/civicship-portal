"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { SignUpForm } from "@/app/sign-up/components/SignUpForm";
import { isPhoneVerified } from "@/contexts/auth/phone/utils";

export default function SignUpPage() {
  const { uid, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!uid) {
      router.push("/login");
      return;
    }

    if (!isPhoneVerified()) {
      router.push("/sign-up/phone-verification");
      return;
    }

    if (user) {
      router.push("/dashboard");
    }
  }, [uid, user, router]);

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-md mx-auto">
        <SignUpForm />
      </div>
    </main>
  );
}
