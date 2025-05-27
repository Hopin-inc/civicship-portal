"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { useHeaderConfig } from "@/components/providers/HeaderProvider";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const { loginWithLiff, isAuthenticating } = useAuth();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useHeaderConfig({
    title: "ログイン",
    showBackButton: false,
    showLogo: true,
  });

  const handleLogin = async () => {
    if (!agreedToTerms || !agreedToPrivacy) {
      toast.error("利用規約とプライバシーポリシーに同意してください");
      return;
    }

    setIsSubmitting(true);

    try {
      await loginWithLiff();
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("ログインに失敗しました。もう一度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = isAuthenticating || isSubmitting;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={120}
            height={120}
            className="mb-6"
          />
          <h1 className="text-2xl font-bold text-center text-gray-900">
            ようこそ
          </h1>
          <p className="mt-2 text-center text-gray-600">
            LINEアカウントでログインしてください
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-start">
            <Checkbox
              id="terms"
              checked={agreedToTerms}
              onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
              className="mt-1"
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
              <Link
                href="/terms"
                target="_blank"
                className="text-blue-600 hover:underline"
              >
                利用規約
              </Link>
              に同意します
            </label>
          </div>

          <div className="flex items-start">
            <Checkbox
              id="privacy"
              checked={agreedToPrivacy}
              onCheckedChange={(checked) => setAgreedToPrivacy(checked === true)}
              className="mt-1"
            />
            <label htmlFor="privacy" className="ml-2 text-sm text-gray-700">
              <Link
                href="/privacy"
                target="_blank"
                className="text-blue-600 hover:underline"
              >
                プライバシーポリシー
              </Link>
              に同意します
            </label>
          </div>

          <Button
            onClick={handleLogin}
            disabled={isLoading || !agreedToTerms || !agreedToPrivacy}
            className="w-full py-3 bg-green-500 hover:bg-green-600"
          >
            {isLoading ? (
              <LoadingSpinner size="sm" className="text-white" />
            ) : (
              "LINEでログイン"
            )}
          </Button>
        </div>

        <p className="mt-4 text-sm text-center text-gray-600">
          アカウントをお持ちでない方は、ログイン後に自動的に登録画面に移動します。
        </p>
      </div>
    </div>
  );
}
