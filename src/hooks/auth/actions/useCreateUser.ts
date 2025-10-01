import { useCallback } from "react";
import { User } from "firebase/auth";
import { toast } from "sonner";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { TokenManager } from "@/lib/auth/token-manager";
import { logger } from "@/lib/logging";
import { GqlCurrentPrefecture, useUserSignUpMutation } from "@/types/graphql";
import { AuthState } from "@/types/auth";

export const useCreateUser = (state: AuthState, refetchUser: () => Promise<any>) => {
  const [userSignUp] = useUserSignUpMutation();

  return useCallback(
    async (
      name: string,
      prefecture: GqlCurrentPrefecture,
      phoneUid: string | null,
    ): Promise<User | null> => {
      try {
        if (!state.firebaseUser) {
          toast.error("LINE認証が完了していません");
          return null;
        }
        if (!phoneUid) {
          toast.error("電話番号認証が完了していません");
          return null;
        }

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
          await refetchUser();
          toast.success("アカウントを作成しました");
          return state.firebaseUser;
        }
        toast.error("アカウント作成に失敗しました");
        return null;
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        logger.error("User creation error", { error: msg });
        toast.error("アカウント作成に失敗しました", { description: msg });
        return null;
      }
    },
    [state.firebaseUser, refetchUser, userSignUp],
  );
};
