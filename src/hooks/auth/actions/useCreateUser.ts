import { useCallback } from "react";
import { logger } from "@/lib/logging";
import { GqlCurrentPrefecture, GqlLanguage, GqlUser, useUserSignUpMutation } from "@/types/graphql";
import { useAuthStore } from "@/lib/auth/core/auth-store";
import { useAuth } from "@/contexts/AuthProvider";
import { getCommunityIdClient } from "@/lib/community/get-community-id-client";

const getLanguageCookie = (): string | null => {
  if (typeof document === "undefined") return null;
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((c) => c.startsWith("language="));
  const [_, ...cookieValues] = cookie?.split("=") ?? [];
  return cookieValues?.length ? cookieValues.join("=") : null;
};

const mapLanguageToEnum = (language: string | null): GqlLanguage | undefined => {
  if (language === "en") return GqlLanguage.En;
  if (language === "ja") return GqlLanguage.Ja;
  return undefined;
};

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

        const languageCookie = getLanguageCookie();
        const preferredLanguage = mapLanguageToEnum(languageCookie);

        const communityId = getCommunityIdClient();
        logger.debug("[AUTH] useCreateUser: calling userSignUp", {
          communityId,
          phoneUid,
          hasLineRefreshToken: !!lineTokens.refreshToken,
          hasPhoneAccessToken: !!phoneTokens.accessToken,
          component: "useCreateUser",
        });

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
              preferredLanguage,
            },
          },
        });

        logger.debug("[AUTH] useCreateUser: userSignUp response", {
          hasData: !!data,
          userId: data?.userSignUp?.user?.id,
          userName: data?.userSignUp?.user?.name,
          communityId,
          component: "useCreateUser",
        });

        if (data?.userSignUp?.user) {
          const user = await updateAuthState();
          logger.debug("[AUTH] useCreateUser: updateAuthState result", {
            hasUser: !!user,
            userId: user?.id,
            memberships: user?.memberships?.map((m) => m.community?.id) ?? [],
            membershipsCount: user?.memberships?.length ?? 0,
            component: "useCreateUser",
          });
          if (user) {
            useAuthStore.getState().setState({
              firebaseUser,
              authenticationState: "user_registered",
              currentUser: user,
            });
            logger.debug("[AUTH] useCreateUser: state set to user_registered", {
              userId: user.id,
              component: "useCreateUser",
            });
            return firebaseUser;
          }
        }
        logger.warn("[AUTH] useCreateUser: userSignUp returned no user or updateAuthState failed", {
          hasSignUpUser: !!data?.userSignUp?.user,
          component: "useCreateUser",
        });
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
