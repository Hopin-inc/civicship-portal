"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { decodeURIComponentWithType, EncodedURIComponent } from "@/utils/path";
import { getLiffLoginErrorMessage } from "@/app/login/utils/getLiffLoginErrorMessage";
import { toast } from "react-toastify";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { LoginView } from "@/app/login/components/LoginView";
import { useAuthStore } from "@/lib/auth/core/auth-store";
import { useLogin } from "@/hooks/auth/actions/useLogin";
import { useAuthDependencies } from "@/hooks/auth/init/useAuthDependencies";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const nextPath = decodeURIComponentWithType(
    (searchParams.get("next") ?? "/") as EncodedURIComponent | null,
  );

  const { liffService, authStateManager } = useAuthDependencies();
  const loginWithLiff = useLogin(liffService, authStateManager);

  const { authenticationState, isAuthenticating } = useAuthStore((s) => s.state);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      toast.error(
        <div>
          <div className="font-bold">{title}</div>
          {description && <div className="text-sm mt-1">{description}</div>}
        </div>,
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticating || authenticationState !== "unauthenticated") {
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
