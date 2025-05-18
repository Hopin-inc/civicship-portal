"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { PhoneVerificationForm } from "./PhoneVerificationForm";

export default function PhoneVerificationPage() {
  const { isLineAuthenticated, isPhoneVerified } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isPhoneVerified) {
      console.log("Phone verification page: Phone already verified, redirecting to sign-up");
      router.push("/sign-up");
    }
    
    if (!isLineAuthenticated) {
      console.log("Phone verification page: User not authenticated with LINE");
    }
  }, [isLineAuthenticated, isPhoneVerified, router]);

  return (
    <div className="container mx-auto py-8">
      {!isLineAuthenticated && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-700">
            LINEログインが完了していません。電話番号認証を完了するにはLINEログインが必要です。
          </p>
          <button 
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => router.push("/login")}
          >
            LINEでログイン
          </button>
        </div>
      )}
      
      <PhoneVerificationForm />
    </div>
  );
}
