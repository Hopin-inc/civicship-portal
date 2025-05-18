"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { PhoneVerificationForm } from "./PhoneVerificationForm";

export default function PhoneVerificationPage() {
  const { isLineAuthenticated, isPhoneVerified } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLineAuthenticated) {
      console.log("Phone verification page: User not authenticated with LINE, redirecting to login");
      router.push("/login");
      return;
    }

    if (isPhoneVerified) {
      console.log("Phone verification page: Phone already verified, redirecting to sign-up");
      router.push("/sign-up");
    }
  }, [isLineAuthenticated, isPhoneVerified, router]);

  return (
    <div className="container mx-auto py-8">
      <PhoneVerificationForm />
    </div>
  );
}
