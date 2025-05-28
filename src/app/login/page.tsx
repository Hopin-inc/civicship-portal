"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { getLiffLoginErrorMessage } from "@/app/login/utils/getLiffLoginErrorMessage";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/";

  const { user, isAuthenticated, loginWithLiff, isAuthenticating, loading } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      if (user) {
        console.log("🚀 Already authenticated, redirecting to:", nextPath);
        router.replace(nextPath);
      } else {
        let signUpWithNext = "/sign-up/phone-verification";
        if (nextPath) {
          signUpWithNext += `?next=${ encodeURIComponent(nextPath) }`;
        }
        router.replace(signUpWithNext);
      }
    }
  }, [isAuthenticated, loading, nextPath, router]);

  // 📦 ログイン処理
  const handleLogin = async () => {
    if (!agreedTerms || !agreedPrivacy) {
      setError("すべての同意が必要です");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const searchParams = new URLSearchParams(window.location.search);
      const next = searchParams.get("next");
      const redirectPath = next && next.startsWith("/") ? `/?next=${next}&from=line_auth` : "/?from=line_auth";
      const success = await loginWithLiff(redirectPath);
      if (success) {
        const nextPath = next && next.startsWith("/") ? next : "/activities";
        router.push(nextPath);
      }
    } catch (err) {
      const { title, description } = getLiffLoginErrorMessage(error);
      toast.error(title, { description });
    } finally {
      setIsLoading(false);
    }
  };

  // 💡 ページスクロール抑制
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (loading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-background rounded-2xl p-6">
          <div className="flex flex-col items-center pt-8">
            <div className="mb-8">
              <Image src="/images/neo88-logo.jpg" alt="NEO88" width={120} height={40} priority />
            </div>
            <p className="text-center mb-6">
              予約を続けるには、
              <br />
              LINEアカウントでログインしてください
            </p>
            <div className="space-y-3 mb-10">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agree-terms"
                  checked={agreedTerms}
                  disabled={isLoading || isAuthenticating}
                  onCheckedChange={(checked) => setAgreedTerms(!!checked)}
                />
                <Label htmlFor="agree-terms" className="text-sm text-muted-foreground">
                  <Link href="/terms" className="underline">
                    利用規約
                  </Link>
                  に同意します
                </Label>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agree-privacy"
                  checked={agreedPrivacy}
                  disabled={isLoading || isAuthenticating}
                  onCheckedChange={(checked) => setAgreedPrivacy(!!checked)}
                />
                <Label htmlFor="agree-privacy" className="text-sm text-muted-foreground">
                  <Link href="/privacy" className="underline">
                    プライバシーポリシー
                  </Link>
                  に同意します
                </Label>
              </div>
            </div>

            <Button
              onClick={handleLogin}
              disabled={isLoading || isAuthenticating}
              className="w-full bg-[#06C755] hover:bg-[#05B74B] text-white rounded-xl h-12 flex items-center justify-center gap-2"
            >
              <Image src="/images/line-icon.png" alt="LINE" width={24} height={24} priority />
              {isLoading || isAuthenticating ? "ログイン中..." : "LINEでログイン"}
            </Button>
            {error && <div className="text-destructive text-sm mt-2">{error}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
