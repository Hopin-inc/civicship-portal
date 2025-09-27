"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import { LiffService } from "@/lib/auth/liff-service";
import { AuthRedirectService } from "@/lib/auth/auth-redirect-service";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { logger } from "@/lib/logging";

const headerConfig = {
  showHeader: false,
  showBackButton: false,
  title: "",
};

interface LoginClientProps {
  nextPath: string;
}

export default function LoginClient({ nextPath }: LoginClientProps) {
  const { authenticationState, loading } = useAuth();
  const router = useRouter();
  const [liffInitialized, setLiffInitialized] = useState(false);
  const hasRedirected = useRef(false);
  const liffExecuted = useRef(false);

  useHeaderConfig(headerConfig);

  const authRedirectService = React.useMemo(() => {
    return AuthRedirectService.getInstance();
  }, []);

  const liffService = React.useMemo(() => {
    const liffId = process.env.NEXT_PUBLIC_LIFF_ID;
    if (!liffId) {
      throw new Error("LIFF ID is not configured");
    }
    return LiffService.getInstance(liffId);
  }, []);

  useEffect(() => {
    if (hasRedirected.current) return;

    const redirectPath = authRedirectService.getRedirectPath("/login" as any, nextPath as any);
    if (redirectPath) {
      hasRedirected.current = true;
      router.replace(redirectPath);
    }
  }, [authenticationState, router, authRedirectService, nextPath]);

  useEffect(() => {
    if (loading || liffInitialized || liffExecuted.current) return;

    const initializeLiff = async () => {
      try {
        liffExecuted.current = true;
        const success = await liffService.initialize();
        if (success) {
          setLiffInitialized(true);
          
          const success = await liffService.login(nextPath as any);
          if (success) {
            logger.debug("LIFF login successful", {
              authType: "liff",
              component: "LoginClient",
            });
          }
        }
      } catch (error) {
        logger.info("LIFF initialization failed", {
          authType: "liff",
          error: error instanceof Error ? error.message : String(error),
          component: "LoginClient",
        });
      }
    };

    initializeLiff();
  }, [loading, liffInitialized, liffService, nextPath]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            ログイン中...
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            LINEでログインしています
          </p>
        </div>
      </div>
    </div>
  );
}
