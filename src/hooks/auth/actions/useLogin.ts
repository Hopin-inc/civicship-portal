import { useCallback } from "react";
import { logger } from "@/lib/logging";
import { LiffService } from "@/lib/auth/liff-service";
import { RawURIComponent } from "@/utils/path";
import { useAuthStore } from "@/hooks/auth/auth-store";

export const useLogin = (liffService: LiffService, refetchUser: () => Promise<any>) => {
  const setState = useAuthStore((s) => s.setState);

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
