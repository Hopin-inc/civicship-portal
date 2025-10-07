import { useCallback } from "react";
import { logger } from "@/lib/logging";
import { LiffService } from "@/lib/auth/liff-service";
import { RawURIComponent } from "@/utils/path";
import { useAuthStore } from "@/hooks/auth/auth-store";
import { GqlUser } from "@/types/graphql";

export const useLogin = (liffService: LiffService, refetchUser: () => Promise<GqlUser | null>) => {
  const setState = useAuthStore((s) => s.setState);

  return useCallback(
    async (redirectPath?: RawURIComponent): Promise<boolean> => {
      setState({ isAuthenticating: true, authenticationState: "authenticating" });

      try {
        if (!liffService.getState().isInitialized) {
          await liffService.initialize();
        }

        const loggedIn = await liffService.login(redirectPath);
        if (!loggedIn) return false;

        return await liffService.signInWithLiffToken();
      } catch (error) {
        logger.warn("LIFF login failed", {
          error: error instanceof Error ? error.message : String(error),
        });
        return false;
      }
    },
    [setState, liffService],
  );
};
