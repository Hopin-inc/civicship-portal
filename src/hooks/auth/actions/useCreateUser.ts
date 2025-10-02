import { useCallback } from "react";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { TokenManager } from "@/lib/auth/token-manager";
import { logger } from "@/lib/logging";
import { GqlCurrentPrefecture, useUserSignUpMutation } from "@/types/graphql";
import { useAuthStore } from "@/hooks/auth/auth-store";

export const useCreateUser = (refetchUser: () => Promise<any>) => {
  const [userSignUp] = useUserSignUpMutation();
  const firebaseUser = useAuthStore((s) => s.state.firebaseUser);

  return useCallback(
    async (name: string, prefecture: GqlCurrentPrefecture, phoneUid: string) => {
      try {
        const phoneTokens = TokenManager.getPhoneTokens();
        const lineTokens = TokenManager.getLineTokens();

        const { data } = await userSignUp({
          variables: {
            input: {
              name,
              currentPrefecture: prefecture,
              communityId: COMMUNITY_ID,
              phoneUid,
              phoneNumber: phoneTokens.phoneNumber ?? undefined,
              lineRefreshToken: lineTokens.refreshToken ?? undefined,
              phoneRefreshToken: phoneTokens.refreshToken ?? undefined,
            },
          },
        });

        if (data?.userSignUp?.user) {
          const { data: refreshed } = await refetchUser();
          if (refreshed?.currentUser?.user) {
            useAuthStore.getState().setState({
              firebaseUser,
              authenticationState: "user_registered",
              currentUser: refreshed.currentUser.user,
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
