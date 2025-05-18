"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { SignUpForm } from "@/app/sign-up/components/SignUpForm";

export default function SignUpPage() {
  const { uid, user, isPhoneVerified, isLineAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLineAuthenticated) {
      console.log("Sign-up page: User not authenticated with LINE, redirecting to login");
      router.push("/login");
      return;
    }

    if (!isPhoneVerified) {
      console.log("Sign-up page: Phone not verified, redirecting to phone verification");
      router.push("/sign-up/phone-verification");
      return;
    }

    if (user) {
      console.log("Sign-up page: User already exists, redirecting to dashboard");
      router.push("/dashboard");
    }
  }, [uid, user, isPhoneVerified, isLineAuthenticated, router]);

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-md mx-auto">
        <SignUpForm />
      </div>
    </main>
  );
}
