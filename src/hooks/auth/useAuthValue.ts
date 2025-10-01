import { useCallback, useMemo } from "react";
import { AuthContextType } from "@/types/auth";
import { PhoneAuthService } from "@/lib/auth/phone-auth-service";
import { useAuthStore } from "./auth-store";

type UseAuthValueArgs = {
  userLoading: boolean;
  refetchUser: () => Promise<any>;
  phoneAuthService: PhoneAuthService;
  actions: {
    loginWithLiff: AuthContextType["loginWithLiff"];
    logout: AuthContextType["logout"];
    createUser: AuthContextType["createUser"];
    verifyPhoneCode: AuthContextType["phoneAuth"]["verifyPhoneCode"];
    startPhoneVerification: AuthContextType["phoneAuth"]["startPhoneVerification"];
  };
};

export const useAuthValue = ({
  userLoading,
  refetchUser,
  phoneAuthService,
  actions,
}: UseAuthValueArgs): AuthContextType => {
  const phoneAuth = useAuthStore((s) => s.phoneAuth);
  const firebaseUser = useAuthStore((s) => s.state.firebaseUser);
  const currentUser = useAuthStore((s) => s.state.currentUser);
  const authenticationState = useAuthStore((s) => s.state.authenticationState);
  const isAuthenticating = useAuthStore((s) => s.state.isAuthenticating);
  const environment = useAuthStore((s) => s.state.environment);

  const stableRefetchUser = useCallback(async () => {
    await refetchUser();
  }, [refetchUser]);

  return useMemo(
    () => ({
      user: currentUser,
      firebaseUser,
      uid: firebaseUser?.uid || null,
      isAuthenticated: ["line_authenticated", "phone_authenticated", "user_registered"].includes(
        authenticationState,
      ),
      isPhoneVerified: ["phone_authenticated", "user_registered"].includes(authenticationState),
      isUserRegistered: authenticationState === "user_registered",
      authenticationState,
      isAuthenticating,
      environment,
      loginWithLiff: actions.loginWithLiff,
      logout: actions.logout,
      phoneAuth: {
        startPhoneVerification: actions.startPhoneVerification,
        verifyPhoneCode: actions.verifyPhoneCode,
        clearRecaptcha: () => phoneAuthService.clearRecaptcha(),
        isVerifying: phoneAuth.isVerifying,
        phoneUid: phoneAuth.phoneUid,
      },
      createUser: actions.createUser,
      updateAuthState: stableRefetchUser,
      loading: authenticationState === "loading" || userLoading || isAuthenticating,
    }),
    [
      currentUser,
      firebaseUser,
      authenticationState,
      isAuthenticating,
      environment,
      actions,
      phoneAuthService,
      stableRefetchUser,
      userLoading,
    ],
  );
};
