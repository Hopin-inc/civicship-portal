import { useEffect, useState } from "react";
import { AuthStateManager } from "@/lib/auth/auth-state-manager";
import { useAuthStore } from "@/hooks/auth/auth-store";

type UseAuthInitializationArgs = {
  authStateManager: AuthStateManager | null;
};

export const useAuthInitialization = ({ authStateManager }: UseAuthInitializationArgs) => {
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);
  const [authInitError, setAuthInitError] = useState<string | null>(null);
  const setState = useAuthStore((s) => s.setState);

  useEffect(() => {
    if (!authStateManager) return;

    const initializeAuth = async () => {
      try {
        await authStateManager.initialize();
        setIsAuthInitialized(true);
        setAuthInitError(null);
        const currentState = authStateManager.getState();
        setState({ authenticationState: currentState });
      } catch (error) {
        setAuthInitError(error instanceof Error ? error.message : "認証の初期化に失敗しました");
        setIsAuthInitialized(false);
      }
    };

    if (!isAuthInitialized && !authInitError) {
      initializeAuth();
    }
  }, [authStateManager, isAuthInitialized, authInitError, setState]);

  const retryInitialization = () => {
    setAuthInitError(null);
    setIsAuthInitialized(false);
  };

  return { isAuthInitialized, authInitError, retryInitialization };
};
