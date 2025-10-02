import { useEffect, useState } from "react";
import { AuthStateManager } from "@/lib/auth/auth-state-manager";
import { useAuthStore } from "@/hooks/auth/auth-store";
import { useCurrentUserQuery } from "@/types/graphql";

type UseAuthInitializationArgs = {
  authStateManager: AuthStateManager | null;
};

export const useAuthInitialization = ({ authStateManager }: UseAuthInitializationArgs) => {
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);
  const [authInitError, setAuthInitError] = useState<string | null>(null);

  const state = useAuthStore((s) => s.state);
  const setState = useAuthStore((s) => s.setState);

  const {
    data,
    loading: userLoading,
    refetch: refetchUser,
  } = useCurrentUserQuery({
    skip: !authStateManager,
    // skip: !["line_authenticated", "phone_authenticated", "user_registered"].includes(
    //   state.authenticationState,
    // ),
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (!authStateManager) return;
    if (isAuthInitialized || authInitError) return;

    const initializeAuth = async () => {
      try {
        await authStateManager.initialize();
        setIsAuthInitialized(true);
        setAuthInitError(null);
        setState({ authenticationState: authStateManager.getState() });
      } catch (error) {
        setAuthInitError(error instanceof Error ? error.message : "認証の初期化に失敗しました");
        setIsAuthInitialized(false);
      }
    };

    initializeAuth();
  }, [authStateManager, isAuthInitialized, authInitError, setState]);

  useEffect(() => {
    if (data?.currentUser?.user) {
      setState({
        currentUser: data.currentUser.user,
        authenticationState: "user_registered",
      });
      void (async () => {
        try {
          await authStateManager?.handleUserRegistrationStateChange(true);
        } catch (err) {
          console.error("Failed to sync user registration state", err);
        }
      })();
    }
  }, [data, setState, authStateManager]);

  const retryInitialization = () => {
    setAuthInitError(null);
    setIsAuthInitialized(false);
    refetchUser();
  };

  return { isAuthInitialized, authInitError, retryInitialization, userLoading, refetchUser };
};
