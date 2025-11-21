import { useMemo } from "react";
import { AuthContextType } from "@/types/auth";
import { GqlUser } from "@/types/graphql";
import { useAuthStore } from "@/lib/auth/core/auth-store";

type UseAuthValueArgs = {
  refetchUser: () => Promise<GqlUser | null>;
  actions: {
    logout: AuthContextType["logout"];
  };
};

export const useAuthValue = ({ refetchUser, actions }: UseAuthValueArgs): AuthContextType => {
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
      logout: actions.logout,
      // phoneAuth: {
      //   startPhoneVerification: actions.startPhoneVerification,
      //   verifyPhoneCode: actions.verifyPhoneCode,
      //   clearRecaptcha: () => phoneAuthService.clearRecaptcha(),
      //   isVerifying: phoneAuth.isVerifying,
      //   phoneUid: phoneAuth.phoneUid,
      //   phoneNumber: phoneAuth.phoneNumber,
      // },
      updateAuthState: refetchUser,
      loading: authenticationState === "loading" || isAuthenticating,
    }),
    [
      currentUser,
      firebaseUser,
      authenticationState,
      isAuthenticating,
      environment,
      actions.logout,
      refetchUser,
    ],
  );
};
