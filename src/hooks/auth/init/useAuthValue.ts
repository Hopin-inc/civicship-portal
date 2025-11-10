import { useMemo } from "react";
import { AuthContextType } from "@/types/auth";
import { PhoneAuthService } from "@/lib/auth/service/phone-auth-service";
import { GqlUser } from "@/types/graphql";
import { useAuthStore } from "@/lib/auth/core/auth-store";

type UseAuthValueArgs = {
  refetchUser: () => Promise<GqlUser | null>;
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
        phoneNumber: phoneAuth.phoneNumber,
      },
      createUser: actions.createUser,
      updateAuthState: refetchUser,
      loading: authenticationState === "loading" || isAuthenticating,
    }),
    [
      currentUser,
      firebaseUser,
      authenticationState,
      isAuthenticating,
      environment,
      actions.loginWithLiff,
      actions.logout,
      actions.startPhoneVerification,
      actions.verifyPhoneCode,
      actions.createUser,
      phoneAuth.isVerifying,
      phoneAuth.phoneUid,
      phoneAuth.phoneNumber,
      refetchUser,
      phoneAuthService,
    ],
  );
};
