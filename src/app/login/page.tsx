"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import { AuthRedirectService } from "@/lib/auth/auth-redirect-service";
import { decodeURIComponentWithType, EncodedURIComponent } from "@/utils/path";
import { getLiffLoginErrorMessage } from "@/app/login/utils/getLiffLoginErrorMessage";
import { toast } from "sonner";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { LoginView } from "@/app/login/components/LoginView";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const nextPath = decodeURIComponentWithType(
    (searchParams.get("next") ?? "/") as EncodedURIComponent | null,
  );
  const router = useRouter();

  const { loginWithLiff, isAuthenticating, authenticationState, loading } = useAuth();
  const authRedirectService = AuthRedirectService.getInstance();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticating && authenticationState !== "unauthenticated") {
      const redirectPath = authRedirectService.getPostLineAuthRedirectPath(nextPath);
      router.replace(redirectPath);
    }
  }, [authenticationState, nextPath, authRedirectService, isAuthenticating, router]);

  const handleLogin = async (agreedTerms: boolean, agreedPrivacy: boolean) => {
    if (!agreedTerms || !agreedPrivacy) {
      setError("すべての同意が必要です");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await loginWithLiff(nextPath ?? undefined);
    } catch (err) {
      const { title, description } = getLiffLoginErrorMessage(error);
      toast.error(title, { description });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || isAuthenticating || authenticationState !== "unauthenticated") {
    return <LoadingIndicator />;
  }

  return (
    <LoginView
      isLoading={isLoading}
      isAuthenticating={isAuthenticating}
      error={error}
      onLogin={handleLogin}
    />
  );
}
