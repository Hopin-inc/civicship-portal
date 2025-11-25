import { useCallback } from "react";
import { logger } from "@/lib/logging";
import { GqlCurrentPrefecture, useUserSignUpMutation } from "@/types/graphql";
import { useAuthStore } from "@/lib/auth/core/auth-store";
import { useAuth } from "@/contexts/AuthProvider";

export const useCreateUser = () => {
  const [userSignUp] = useUserSignUpMutation();
  const { updateAuthState } = useAuth();
  const firebaseUser = useAuthStore((s) => s.state.firebaseUser);

  return useCallback(
    async (name: string, prefecture: GqlCurrentPrefecture, phoneUid: string) => {
      try {
        const { state, phoneAuth } = useAuthStore.getState();
        const { lineTokens } = state;
        const { phoneTokens } = phoneAuth;

        const { data } = await userSignUp({
          variables: {
            input: {
              name,
              currentPrefecture: prefecture,
              phoneUid,
              phoneNumber: phoneAuth.phoneNumber ?? undefined,
              phoneAccessToken: phoneTokens.accessToken ?? undefined,
              phoneTokenExpiresAt: phoneTokens.expiresAt ?? undefined,
              phoneRefreshToken: phoneTokens.refreshToken ?? undefined,
              lineRefreshToken: lineTokens.refreshToken ?? undefined,
              lineTokenExpiresAt: lineTokens.expiresAt ?? undefined,
            },
          },
        });

        if (data?.userSignUp?.user) {
          const user = await updateAuthState();
          if (user) {
            useAuthStore.getState().setState({
              firebaseUser,
              authenticationState: "user_registered",
              currentUser: user,
            });
            return firebaseUser;
          }
        }
        return null;
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        logger.warn("User creation error", { error: msg });
        return null;
      }
    },
    [firebaseUser, userSignUp, updateAuthState],
  );
};
