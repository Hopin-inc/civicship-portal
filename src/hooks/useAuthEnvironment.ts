import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { AuthEnvironment } from '@/lib/auth/environment-detector';

export const useAuthEnvironment = () => {
  const store = useAuthStore();
  const { environment, liffService, authenticationState } = store;

  useEffect(() => {
    if (environment !== AuthEnvironment.LIFF || !liffService) return;

    const initializeLiff = async () => {
      try {
        const success = await liffService.initialize();
        if (success && liffService.getState().isLoggedIn) {
          await liffService.signInWithLiffToken();
        }
      } catch (error) {
        console.error("LIFF initialization failed:", error);
      }
    };

    if (authenticationState === "unauthenticated") {
      initializeLiff();
    }
  }, [environment, liffService, authenticationState]);

  useEffect(() => {
    if (environment === AuthEnvironment.LIFF && liffService) {
      const liffState = liffService.getState();
      if (liffState.isInitialized && liffState.isLoggedIn && authenticationState === "unauthenticated") {
        liffService.signInWithLiffToken();
      }
    }
  }, [environment, liffService, authenticationState]);

  return {
    environment,
    isLiffEnvironment: environment === AuthEnvironment.LIFF,
  };
};
