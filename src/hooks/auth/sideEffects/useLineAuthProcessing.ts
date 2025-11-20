"use client";

import { useEffect, useRef } from "react";
import { LiffService } from "@/lib/auth/service/liff-service";
import { useAuthStore } from "@/lib/auth/core/auth-store";
import { logger } from "@/lib/logging";
import { GqlUser } from "@/types/graphql";
import { AuthStateManager } from "@/lib/auth/core/auth-state-manager";
import { TokenManager } from "@/lib/auth/core/token-manager";
import { lineAuth } from "@/lib/auth/core/firebase-config";

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
  const setState = useAuthStore((s) => s.setState);

  useEffect(() => {
    if (!shouldProcessRedirect || processedRef.current || !authStateManager) return;

    const handleLineAuthRedirect = async () => {
      processedRef.current = true;
      setState({ isAuthenticating: true });

      console.log('[LIFF_HOOK] start', typeof window !== 'undefined' ? window.location.href : 'SSR');
      console.log('[LIFF_HOOK] shouldProcessRedirect:', shouldProcessRedirect);

      try {
        const initialized = await liffService.initialize();
        console.log('[LIFF_HOOK] initialized:', initialized);

        if (!initialized) {
          logger.info("LIFF init failed", {
            authType: "liff",
            component: "useLineAuthProcessing",
          });
          return; // 🟠 stop: cannot init LIFF
        }

        const { isLoggedIn } = liffService.getState();
        console.log('[LIFF_HOOK] isLoggedIn:', isLoggedIn);
        if (!isLoggedIn) return;

        if (lineAuth.currentUser) {
          logger.info("Firebase already authenticated, skipping signInWithLiffToken", {
            authType: "liff",
            component: "useLineAuthProcessing",
          });
        } else {
          const success = await liffService.signInWithLiffToken();
          console.log('[LIFF_HOOK] signInWithLiffToken:', success);
          if (!success) {
            logger.info("signInWithLiffToken failed", {
              authType: "liff",
              component: "useLineAuthProcessing",
            });
            return; // 🟠 stop: login token exchange failed
          }
        }

        const user = await refetchUser();
        console.log('[LIFF_HOOK] refetchUser:', { hasUser: !!user });
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
          console.log('[LIFF_HOOK] auth state: user_registered');
        } else {
          setState({
            currentUser: user,
            authenticationState: "line_authenticated",
            isAuthenticating: false,
          });
          authStateManager.updateState("line_authenticated", "useLineAuthProcessing");
          await authStateManager.handleUserRegistrationStateChange(false);
          console.log('[LIFF_HOOK] auth state: line_authenticated');
        }
        console.log('[LIFF_HOOK] no client redirect (diagnostic)');
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
