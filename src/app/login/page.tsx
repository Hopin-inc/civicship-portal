"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { getLiffLoginErrorMessage } from "@/app/login/utils/getLiffLoginErrorMessage";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { AuthRedirectService } from "@/lib/auth/auth-redirect-service";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import clientLogger from "@/lib/logging/client";
import { getCommunityLogo } from "@/lib/community/assetService";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/";
  const router = useRouter();

  const headerConfig = useMemo(
    () => ({
      title: "ログイン",
      showBackButton: false,
      showLogo: false,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  const { loginWithLiff, isAuthenticating, authenticationState, loading } = useAuth();
  const authRedirectService = AuthRedirectService.getInstance();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);

  useEffect(() => {
    if (!isAuthenticating && authenticationState === "line_authenticated") {
      const redirectPath = authRedirectService.getPostLineAuthRedirectPath(nextPath);
      router.replace(redirectPath);
    }
  }, [authenticationState, router, nextPath, authRedirectService, isAuthenticating]);

  // 📦 ログイン処理
  const handleLogin = async () => {
    if (!agreedTerms || !agreedPrivacy) {
      setError("すべての同意が必要です");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const redirectPath = authRedirectService.getPostLineAuthRedirectPath(nextPath);
      clientLogger.debug("Using redirect path from AuthRedirectService", {
        redirectPath,
        component: "LoginPage"
      });

      const success = await loginWithLiff(redirectPath);

      if (success) {
        clientLogger.debug("LINE authentication succeeded. Redirecting...", {
          component: "LoginPage"
        });
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

  if (loading || isAuthenticating) {
    return <LoadingIndicator />;
  }

  return (
    <div className="w-full max-w-mobile-l bg-background rounded-2xl p-6 mx-4">
      <div className="flex flex-col items-center pt-8">
        <div className="mb-12">
          <Image src={getCommunityLogo()} alt="NEO88" width={120} height={40} priority />
        </div>

        <div className="space-y-3 mb-10">
          <div className="flex items-start space-x-4">
            <Checkbox
              id="agree-terms"
              checked={agreedTerms}
              className="w-5 h-5"
              disabled={isLoading || isAuthenticating}
              onCheckedChange={(checked) => setAgreedTerms(!!checked)}
            />
            <Label htmlFor="agree-terms" className="text-sm text-muted-foreground">
              <Link href="/terms" className="underline">
                利用規約
              </Link>
              に同意する
            </Label>
          </div>

          <div className="flex items-start space-x-4">
            <Checkbox
              id="agree-privacy"
              checked={agreedPrivacy}
              className="w-5 h-5"
              disabled={isLoading || isAuthenticating}
              onCheckedChange={(checked) => setAgreedPrivacy(!!checked)}
            />
            <Label htmlFor="agree-privacy" className="text-sm text-muted-foreground">
              <Link href="/privacy" className="underline">
                プライバシーポリシー
              </Link>
              に同意する
            </Label>
          </div>
        </div>

        <Button
          onClick={handleLogin}
          disabled={isLoading || isAuthenticating || !agreedTerms || !agreedPrivacy}
          className="w-full bg-[#06C755] hover:bg-[#05B74B] text-white rounded-xl h-12 flex items-center justify-center gap-2"
        >
          <Image src="/images/line-icon.png" alt="LINE" width={24} height={24} priority />
          {isLoading || isAuthenticating ? "ログイン中..." : "LINEでログイン"}
        </Button>
        {error && <div className="text-destructive text-sm mt-2">{error}</div>}
      </div>
    </div>
  );
}
