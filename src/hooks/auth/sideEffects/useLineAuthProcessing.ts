"use client";

import { useEffect, useRef } from "react";
import { LiffService } from "@/lib/auth/service/liff-service";
import { useAuthStore } from "@/lib/auth/core/auth-store";
import { logger } from "@/lib/logging";
import { GqlUser } from "@/types/graphql";
import { AuthStateManager } from "@/lib/auth/core/auth-state-manager";
import { TokenManager } from "@/lib/auth/core/token-manager";
import { lineAuth } from "@/lib/auth/core/firebase-config";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";

interface UseLineAuthProcessingProps {
  shouldProcessRedirect: boolean;
  liffService: LiffService;
  refetchUser: () => Promise<GqlUser | null>;
  authStateManager: AuthStateManager | null;
  hasFullAuth: boolean;
}

export const useLineAuthProcessing = ({
  shouldProcessRedirect,
  liffService,
  refetchUser,
  authStateManager,
  hasFullAuth,
}: UseLineAuthProcessingProps) => {
  const processedRef = useRef(false);
  const setState = useAuthStore((s) => s.setState);
  const communityConfig = useCommunityConfig();
  const communityId = communityConfig?.communityId;

  useEffect(() => {
    if (!shouldProcessRedirect || processedRef.current || !authStateManager) return;

    // initAuth が既に実行中の場合は二重処理を防ぐ
    const { isAuthInProgress } = useAuthStore.getState().state;
    if (isAuthInProgress) {
      logger.debug("initAuth already in progress, skipping useLineAuthProcessing", {
        component: "useLineAuthProcessing",
      });
      return;
    }

    const handleLineAuthRedirect = async () => {
      processedRef.current = true;

      // SSR で user/line/phone そろってるなら、LIFF 初期化も含めて全てスキップ
      if (hasFullAuth) {
        logger.debug("SSR full auth detected; skipping all LIFF processing", {
          authType: "liff",
          component: "useLineAuthProcessing",
        });
        return;
      }

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

        // lineAuth.currentUser または lineTokens.idToken（exchange 経由）があればスキップ
        const { lineTokens } = useAuthStore.getState().state;
        if (lineAuth.currentUser || lineTokens.idToken) {
          logger.debug("Already authenticated (Firebase user or exchange token), skipping signInWithLiffToken", {
            authType: "liff",
            hasFirebaseUser: !!lineAuth.currentUser,
            hasExchangeToken: !!lineTokens.idToken,
            component: "useLineAuthProcessing",
          });
        } else {
          const success = await liffService.signInWithLiffToken();
          if (!success) {
            logger.warn("signInWithLiffToken failed", {
              authType: "liff",
              component: "useLineAuthProcessing",
            });
            return; // 🟠 stop: login token exchange failed
          }
        }

        const user = await refetchUser();
        if (!user) {
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
        const hasMembership = !!user.memberships?.some((m) => m.community?.id === communityId);

        if (hasPhoneIdentity || TokenManager.phoneVerified()) {
          TokenManager.savePhoneAuthFlag(true);
          
          // Only set user_registered if BOTH phone identity AND membership exist
          if (hasMembership) {
            logger.debug("[AUTH] useLineAuthProcessing: setting user_registered", {
              userId: user.id,
              hasPhoneIdentity,
              hasMembership,
              authState: "user_registered",
            });
            setState({
              currentUser: user,
              authenticationState: "user_registered",
              isAuthenticating: false,
            });
            authStateManager.updateState("user_registered", "useLineAuthProcessing (phone + membership)");
            await authStateManager.handleUserRegistrationStateChange(true);
          } else {
            logger.debug("[AUTH] useLineAuthProcessing: setting phone_authenticated", {
              userId: user.id,
              hasPhoneIdentity,
              hasMembership,
              authState: "phone_authenticated",
            });
            setState({
              currentUser: user,
              authenticationState: "phone_authenticated",
              isAuthenticating: false,
            });
            authStateManager.updateState("phone_authenticated", "useLineAuthProcessing (phone only, no membership)");
          }
        } else {
          setState({
            currentUser: user,
            authenticationState: "line_authenticated",
            isAuthenticating: false,
          });
          authStateManager.updateState("line_authenticated", "useLineAuthProcessing");
          await authStateManager.handleUserRegistrationStateChange(false);
        }
      } catch (err) {
        logger.warn("Error during LINE auth", {
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
  }, [shouldProcessRedirect, refetchUser, setState, liffService, authStateManager, hasFullAuth, communityId]);
};
