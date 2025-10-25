import { useCallback } from "react";
import { logger } from "@/lib/logging";
import { LiffService } from "@/lib/auth/service/liff-service";
import { RawURIComponent } from "@/utils/path";
import { useAuthStore } from "@/lib/auth/core/auth-store";
import { GqlUser } from "@/types/graphql";
import { AuthStateManager } from "@/lib/auth/core/auth-state-manager";
import { useCommunityContext } from "@/contexts/CommunityContext";

export const useLogin = (
  liffService: LiffService,
  refetchUser: () => Promise<GqlUser | null>,
  authStateManager: AuthStateManager | null,
) => {
  const setState = useAuthStore((s) => s.setState);
  const { communityId } = useCommunityContext();

  return useCallback(
    async (redirectPath?: RawURIComponent): Promise<boolean> => {
      if (authStateManager) {
        authStateManager.updateState("authenticating", "useLogin");
      }

      setState({ isAuthenticating: true });

      try {
        if (!liffService.getState().isInitialized) {
          await liffService.initialize();
        }

        const loggedIn = await liffService.login(redirectPath);
        if (!loggedIn) return false;

        return await liffService.signInWithLiffToken(communityId ?? undefined);
      } catch (error) {
        logger.warn("LIFF login failed", {
          error: error instanceof Error ? error.message : String(error),
        });

        if (authStateManager) {
          authStateManager.updateState("unauthenticated", "useLogin failed");
        }

        setState({ isAuthenticating: false });
        return false;
      }
    },
    [setState, liffService, authStateManager, communityId],
  );
};
