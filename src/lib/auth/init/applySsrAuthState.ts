import { useAuthStore } from "@/lib/auth/core/auth-store";
import { AuthenticationState } from "@/types/auth";
import { GqlUser } from "@/types/graphql";
import { logger } from "@/lib/logging";

export function applySsrAuthState(
  ssrCurrentUser?: GqlUser | null,
  ssrLineAuthenticated?: boolean,
  ssrPhoneAuthenticated?: boolean,
  ssrLineIdToken?: string | null,
  ssrLineTokenExpiresAt?: string | null,
) {
  if (!ssrLineAuthenticated && !ssrPhoneAuthenticated && !ssrCurrentUser) return;

  let initialState: AuthenticationState = "loading";
  if (ssrCurrentUser && ssrLineAuthenticated && ssrPhoneAuthenticated) {
    initialState = "user_registered";
  } else if (ssrCurrentUser && ssrLineAuthenticated) {
    initialState = "line_authenticated";
  }

  // SSR 側で取得できた LINE 由来 idToken があればストアに流し込む。
  // これにより、クライアント側の Firebase 再初期化を待たずに
  // `isAuthReady` が true になり、ログイン直後の送金ボタン非活性タイミングを解消する。
  const hasValidSsrIdToken = Boolean(
    ssrLineIdToken &&
      ssrLineTokenExpiresAt &&
      Number(ssrLineTokenExpiresAt) > Date.now(),
  );

  logger.debug("[AUTH] applySsrAuthState", {
    initialState,
    ssrCurrentUser: !!ssrCurrentUser,
    ssrCurrentUserId: ssrCurrentUser?.id,
    ssrLineAuthenticated,
    ssrPhoneAuthenticated,
    hasValidSsrIdToken,
  });

  const { state, setState } = useAuthStore.getState();
  setState({
    authenticationState: initialState,
    currentUser: ssrCurrentUser ?? null,
    isAuthenticating: false,
    isAuthInProgress: false,
    ...(hasValidSsrIdToken
      ? {
          lineTokens: {
            ...state.lineTokens,
            idToken: ssrLineIdToken ?? null,
            expiresAt: ssrLineTokenExpiresAt ?? null,
          },
        }
      : {}),
  });
}
