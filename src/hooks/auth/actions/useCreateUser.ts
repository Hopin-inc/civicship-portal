import { useCallback } from "react";
import { logger } from "@/lib/logging";
import { GqlCurrentPrefecture, GqlLanguage, GqlUser, useUserSignUpMutation } from "@/types/graphql";
import { useAuthStore } from "@/lib/auth/core/auth-store";
import { useAuth } from "@/contexts/AuthProvider";

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
