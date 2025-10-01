import { useMemo } from "react";
import { AuthContextType, AuthState } from "@/types/auth";
import { PhoneAuthService } from "@/lib/auth/phone-auth-service";

type UseAuthValueArgs = {
  state: AuthState;
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
  state,
  userLoading,
  refetchUser,
  phoneAuthService,
  actions,
}: UseAuthValueArgs): AuthContextType => {
  return useMemo(() => {
    return {
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
        isVerifying: phoneAuthService.getState().isVerifying,
        phoneUid: phoneAuthService.getState().phoneUid,
      },
      createUser: actions.createUser,
      updateAuthState: async () => {
        await refetchUser();
      },
      loading: state.authenticationState === "loading" || userLoading || state.isAuthenticating,
    };
  }, [state, userLoading, refetchUser, phoneAuthService, actions]);
};
