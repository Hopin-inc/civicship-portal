import { useCallback } from "react";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { logger } from "@/lib/logging";
import { GqlCurrentPrefecture, GqlUser, useUserSignUpMutation } from "@/types/graphql";
import { useAuthStore } from "@/hooks/auth/auth-store";

export const useCreateUser = (refetchUser: () => Promise<GqlUser | null>) => {
  const [userSignUp] = useUserSignUpMutation();
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
              communityId: COMMUNITY_ID,
              phoneUid,
              phoneNumber: phoneAuth.phoneNumber ?? undefined,
              lineRefreshToken: lineTokens.refreshToken ?? undefined,
              phoneRefreshToken: phoneTokens.refreshToken ?? undefined,
            },
          },
        });

        if (data?.userSignUp?.user) {
          const user = await refetchUser();
          if (user) {
            useAuthStore.getState().setState({
              firebaseUser,
              authenticationState: "user_registered",
              currentUser: user,
            });
          }
          return firebaseUser;
        }
        return null;
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        logger.error("User creation error", { error: msg });
        return null;
      }
    },
    [firebaseUser, refetchUser, userSignUp],
  );
};
