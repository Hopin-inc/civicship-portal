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
import { logger } from "@/lib/logging";
import { currentCommunityConfig } from "@/lib/communities/metadata";
import { decodeURIComponentWithType, EncodedURIComponent } from "@/utils/path";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const nextPath = decodeURIComponentWithType((searchParams.get("next") ?? "/") as EncodedURIComponent | null);
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
    if (!isAuthenticating) {
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
      logger.debug("Using redirect path from AuthRedirectService", {
        redirectPath,
        component: "LoginPage",
      });

      const success = await loginWithLiff(redirectPath);

      if (success) {
        logger.debug("LINE authentication succeeded. Redirecting...", {
          component: "LoginPage",
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

  if (
    loading ||
    isAuthenticating ||
    authenticationState === "line_authenticated" ||
    authenticationState === "loading"
  ) {
    return <LoadingIndicator />;
  }

  return (
    <div className="flex items-center justify-center p-12">
      <div className="w-full max-w-mobile-l">
        <div className="space-y-3 mb-10">
          <div className="text-body-md mb-6">
            <strong className="font-bold">{currentCommunityConfig.title}</strong>
            を利用するにはLINEでログインして下さい
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-4">
              <Checkbox
                id="agree-terms"
                checked={agreedTerms}
                className="w-5 h-5"
                disabled={isLoading || isAuthenticating}
                onCheckedChange={(checked) => setAgreedTerms(!!checked)}
              />
              <Label htmlFor="agree-terms" className="text-label-md text-muted-foreground">
                <Link href="/terms" className="underline">
                  利用規約
                </Link>
                <span className="text-label-sm">に同意する</span>
              </Label>
            </div>

            <div className="flex items-center space-x-4">
              <Checkbox
                id="agree-privacy"
                checked={agreedPrivacy}
                className="w-5 h-5"
                disabled={isLoading || isAuthenticating}
                onCheckedChange={(checked) => setAgreedPrivacy(!!checked)}
              />
              <Label htmlFor="agree-privacy" className="text-label-md text-muted-foreground">
                <Link href="/privacy" className="underline">
                  プライバシーポリシー
                </Link>
                <span className="text-label-sm">に同意する</span>
              </Label>
            </div>
          </div>
        </div>

        {error && <div className="text-destructive text-sm mt-2">{error}</div>}

        <Button
          onClick={handleLogin}
          disabled={isLoading || isAuthenticating}
          className="w-full bg-[#06C755] hover:bg-[#05B74B] text-white rounded-full h-14 flex items-center justify-center gap-2"
        >
          <Image src="/images/line-icon.png" alt="LINE" width={24} height={24} priority />
          {isLoading || isAuthenticating ? "ログイン中..." : "LINEでログイン"}
        </Button>
      </div>
    </div>
  );
}
