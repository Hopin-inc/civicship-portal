import { useMemo } from "react";
import { AuthContextType } from "@/types/auth";
import { PhoneAuthService } from "@/lib/auth/phone-auth-service";
import { useAuthStore } from "./auth-store";
import { GqlUser } from "@/types/graphql";

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
  const { state, phoneAuth } = useAuthStore((s) => ({
    state: s.state,
    phoneAuth: s.phoneAuth,
  }));

  return useMemo(
    () => ({
      user: state.currentUser,
      firebaseUser: state.firebaseUser,
      uid: state.firebaseUser?.uid || null,
      isAuthenticated: ["line_authenticated", "phone_authenticated", "user_registered"].includes(
        state.authenticationState,
      ),
      isPhoneVerified: ["phone_authenticated", "user_registered"].includes(
        state.authenticationState,
      ),
      isUserRegistered: state.authenticationState === "user_registered",
      authenticationState: state.authenticationState,
      isAuthenticating: state.isAuthenticating,
      environment: state.environment,
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
      loading: state.authenticationState === "loading" || state.isAuthenticating,
    }),
    [state, phoneAuth, actions, phoneAuthService, refetchUser],
  );
};
