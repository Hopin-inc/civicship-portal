import { useEffect, useState } from "react";
import { AuthStateManager } from "@/lib/auth/auth-state-manager";
import { AuthState } from "@/types/auth";

type UseAuthInitializationArgs = {
  authStateManager: AuthStateManager | null;
  setState: React.Dispatch<React.SetStateAction<AuthState>>;
};

export const useAuthInitialization = ({
  authStateManager,
  setState,
}: UseAuthInitializationArgs) => {
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);
  const [authInitError, setAuthInitError] = useState<string | null>(null);

  useEffect(() => {
    if (!authStateManager) return;

    const initializeAuth = async () => {
      try {
        await authStateManager.initialize();
        setIsAuthInitialized(true);
        setAuthInitError(null);
        const currentState = authStateManager.getState();
        setState((prev) => ({ ...prev, authenticationState: currentState }));
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
