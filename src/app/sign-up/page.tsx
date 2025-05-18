"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { SignUpForm } from "@/app/sign-up/components/SignUpForm";
import { toast } from "sonner";

export default function SignUpPage() {
  const { uid, user, isPhoneVerified, isLineAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      console.log("Sign-up page: User already exists, redirecting to home");
      router.push("/");
      return;
    }

    if (!isLineAuthenticated) {
      console.log("Sign-up page: User not authenticated with LINE");
    }

    if (!isPhoneVerified) {
      console.log("Sign-up page: Phone not verified");
    }
  }, [user, isPhoneVerified, isLineAuthenticated, router]);

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-md mx-auto">
        {!isLineAuthenticated && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-700">
              LINEログインが完了していません。ユーザー登録を完了するにはLINEログインが必要です。
            </p>
            <button 
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => router.push("/login")}
            >
              LINEでログイン
            </button>
          </div>
        )}

        {isLineAuthenticated && !isPhoneVerified && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-700">
              電話番号認証が完了していません。ユーザー登録を完了するには電話番号認証が必要です。
            </p>
            <button 
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => router.push("/sign-up/phone-verification")}
            >
              電話番号認証へ進む
            </button>
          </div>
        )}

        <SignUpForm />
      </div>
    </main>
  );
}
