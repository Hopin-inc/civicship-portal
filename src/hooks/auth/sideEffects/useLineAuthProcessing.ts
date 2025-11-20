"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { LiffService } from "@/lib/auth/service/liff-service";
import { useAuthStore } from "@/lib/auth/core/auth-store";
import { logger } from "@/lib/logging";
import { GqlUser } from "@/types/graphql";
import { AuthStateManager } from "@/lib/auth/core/auth-state-manager";
import { TokenManager } from "@/lib/auth/core/token-manager";
import { lineAuth } from "@/lib/auth/core/firebase-config";
import { AuthRedirectService } from "@/lib/auth/service/auth-redirect-service";

interface UseLineAuthProcessingProps {
  shouldProcessRedirect: boolean;
  liffService: LiffService;
  refetchUser: () => Promise<GqlUser | null>;
  authStateManager: AuthStateManager | null;
}

export const useLineAuthProcessing = ({
  shouldProcessRedirect,
  liffService,
  refetchUser,
  authStateManager,
}: UseLineAuthProcessingProps) => {
  const processedRef = useRef(false);
  const redirectedRef = useRef(false);
  const setState = useAuthStore((s) => s.setState);
  const router = useRouter();
  const authRedirectService = AuthRedirectService.getInstance();

  useEffect(() => {
    if (!shouldProcessRedirect || processedRef.current || !authStateManager) return;

    const handleLineAuthRedirect = async () => {
      processedRef.current = true;
      setState({ isAuthenticating: true });

      try {
        const initialized = await liffService.initialize();

        if (!initialized) {
          logger.info("LIFF init failed", {
            authType: "liff",
            component: "useLineAuthProcessing",
          });
          return; // 🟠 stop: cannot init LIFF
        }

        const { isLoggedIn } = liffService.getState();
        if (!isLoggedIn) return;

        const success = await liffService.signInWithLiffToken();
        if (!success) {
          logger.info("signInWithLiffToken failed", {
            authType: "liff",
            component: "useLineAuthProcessing",
          });
          return;
        }

        const user = await refetchUser();
        if (!user) {
          TokenManager.saveLineAuthFlag(true);
          setState({
            authenticationState: "line_authenticated",
            isAuthenticating: false,
          });
          authStateManager.updateState(
            "line_authenticated",
            "useLineAuthProcessing (no user found)",
          );
          await authStateManager.handleUserRegistrationStateChange(false);
          return;
        }

        const hasPhoneIdentity = !!user.identities?.some(
          (i) => i.platform?.toUpperCase() === "PHONE",
        );
        if (hasPhoneIdentity || TokenManager.phoneVerified()) {
          TokenManager.savePhoneAuthFlag(true);
          setState({
            currentUser: user,
            authenticationState: "user_registered",
            isAuthenticating: false,
          });
          authStateManager.updateState("user_registered", "useLineAuthProcessing (phone verified)");
          await authStateManager.handleUserRegistrationStateChange(true);
        } else {
          setState({
            currentUser: user,
            authenticationState: "line_authenticated",
            isAuthenticating: false,
          });
          authStateManager.updateState("line_authenticated", "useLineAuthProcessing");
          await authStateManager.handleUserRegistrationStateChange(false);
        }

        if (!redirectedRef.current && typeof window !== "undefined") {
          redirectedRef.current = true;
          
          const searchParams = new URLSearchParams(window.location.search);
          const next = searchParams.get("next") || searchParams.get("liff.state");
          const pathname = window.location.pathname;
          
          const redirectPath = authRedirectService.getRedirectPath(
            pathname as any,
            next as any,
            user
          );
          
          if (redirectPath) {
            router.replace(redirectPath);
          }
        }
      } catch (err) {
        logger.info("Error during LINE auth", {
          authType: "liff",
          error: err instanceof Error ? err.message : String(err),
          component: "useLineAuthProcessing",
        });
      } finally {
        setState({ isAuthenticating: false });
        // Delay reset slightly to avoid immediate re-trigger in concurrent renders
        setTimeout(() => {
          processedRef.current = false;
        }, 500);
      }
    };

    handleLineAuthRedirect();
  }, [shouldProcessRedirect, refetchUser, setState, liffService, authStateManager]);
};
