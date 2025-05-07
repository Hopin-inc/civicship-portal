"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { loginWithLiff, isAuthenticating } = useAuth();

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await loginWithLiff();
      setIsLoading(false);
    } catch (err) {
      setError("ログインに失敗しました");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-background rounded-2xl p-6">
          <div className="flex flex-col items-center pt-8">
            <div className="mb-8">
              <Image
                src="/images/neo88-logo.jpg"
                alt="NEO88"
                width={120}
                height={40}
                priority
              />
            </div>
            <p className="text-center mb-6">
              予約を続けるには、<br />
              LINEアカウントでログインしてください
            </p>
            <Button
              onClick={handleLogin}
              disabled={isLoading || isAuthenticating}
              className="w-full bg-[#06C755] hover:bg-[#05B74B] text-white rounded-xl h-12 flex items-center justify-center gap-2"
            >
              <Image
                src="/images/line-icon.png"
                alt="LINE"
                width={24}
                height={24}
                priority
              />
              {isLoading || isAuthenticating ? "ログイン中..." : "LINEでログイン"}
            </Button>
            {error && <div className="text-destructive text-sm mt-2">{error}</div>}
            <p className="text-sm text-muted-foreground mt-4">
              ログインすることで、
              <Link href="/terms" className="underline">
                利用規約
              </Link>
              と
              <Link href="/privacy" className="underline">
                プライバシーポリシー
              </Link>
              に同意したことになります。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}    