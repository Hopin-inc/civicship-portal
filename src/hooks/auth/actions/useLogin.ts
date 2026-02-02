import { useCallback } from "react";
import { logger } from "@/lib/logging";
import { LiffService } from "@/lib/auth/service/liff-service";
import { RawURIComponent } from "@/utils/path";
import { useAuthStore } from "@/lib/auth/core/auth-store";
import { AuthStateManager } from "@/lib/auth/core/auth-state-manager";

export const useLogin = (liffService: LiffService, authStateManager: AuthStateManager | null) => {
  const setState = useAuthStore((s) => s.setState);

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

        // 🔍 DEBUG: テナントIDパラメータを確認
        logger.info("[useLogin] 🔍 DEBUG: Calling signInWithLiffToken", {
          tenantIdParam: undefined,
          note: "No tenant ID is being passed to signInWithLiffToken",
        });

        return await liffService.signInWithLiffToken();
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
    [setState, liffService, authStateManager],
  );
};
