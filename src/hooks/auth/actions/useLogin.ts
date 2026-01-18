import { useCallback } from "react";
import { logger } from "@/lib/logging";
import { LiffService } from "@/lib/auth/service/liff-service";
import { useAuthStore } from "@/lib/auth/core/auth-store";
import { AuthStateManager } from "@/lib/auth/core/auth-state-manager";

export const useLogin = (liffService: LiffService, authStateManager: AuthStateManager | null) => {
  const setState = useAuthStore((s) => s.setState);

  return useCallback(
    async (redirectPath?: string): Promise<void> => {
      // Debug logging when login button is clicked
      const liffState = liffService.getState();
      console.log("[useLogin] Login button clicked - LIFF state:", {
        isInitialized: liffState.isInitialized,
        isLoggedIn: liffState.isLoggedIn,
        hasError: !!liffState.error,
        errorMessage: liffState.error?.message,
        liffServiceInstance: liffService,
      });
      
      if (authStateManager) {
        authStateManager.updateState("authenticating", "useLogin");
      }

      setState({ isAuthenticating: true });

      try {
        if (!liffService.getState().isInitialized) {
          console.log("[useLogin] Initializing LIFF...");
          await liffService.initialize();
          console.log("[useLogin] LIFF initialized, state:", liffService.getState());
        }

        const loggedIn = await liffService.login(redirectPath as any);
        console.log("[useLogin] LIFF login result:", { loggedIn });
        if (loggedIn) {
          console.log("[useLogin] Calling signInWithLiffToken...");
          await liffService.signInWithLiffToken();
        }
      } catch (error) {
        logger.warn("LIFF login failed", {
          error: error instanceof Error ? error.message : String(error),
        });

        if (authStateManager) {
          authStateManager.updateState("unauthenticated", "useLogin failed");
        }
      } finally {
        setState({ isAuthenticating: false });
      }
    },
    [setState, liffService, authStateManager],
  );
};
