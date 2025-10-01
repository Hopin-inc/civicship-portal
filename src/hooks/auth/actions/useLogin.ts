import { useCallback } from "react";
import { logger } from "@/lib/logging";
import { AuthState } from "@/types/auth";
import { LiffService } from "@/lib/auth/liff-service";
import { RawURIComponent } from "@/utils/path";

export const useLogin = (
  setState: (partial: Partial<AuthState>) => void,
  liffService: LiffService,
  refetchUser: () => Promise<any>,
) => {
  return useCallback(
    async (redirectPath?: RawURIComponent): Promise<boolean> => {
      setState({ isAuthenticating: true });
      try {
        await liffService.initialize();
        const loggedIn = await liffService.login(redirectPath);
        if (!loggedIn) return false;
        const success = await liffService.signInWithLiffToken();
        if (success) await refetchUser();
        return success;
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        logger.warn("LIFF login failed", { error: msg });
        return false;
      } finally {
        setState({ isAuthenticating: false });
      }
    },
    [setState, liffService, refetchUser],
  );
};
