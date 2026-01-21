import { useAuthStore } from "@/lib/auth/core/auth-store";
import { AuthenticationState } from "@/types/auth";
import { GqlUser } from "@/types/graphql";
import { logger } from "@/lib/logging";
import { getCommunityIdFromEnv } from "@/lib/communities/config";

export function applySsrAuthState(
  ssrCurrentUser?: GqlUser | null,
  ssrLineAuthenticated?: boolean,
  ssrPhoneAuthenticated?: boolean,
) {
  if (!ssrLineAuthenticated && !ssrPhoneAuthenticated && !ssrCurrentUser) return;

  const communityId = getCommunityIdFromEnv();
  const hasMembershipInCurrentCommunity = !!ssrCurrentUser?.memberships?.some(
    (m) => m.community?.id === communityId
  );
  const isFullyRegistered = ssrPhoneAuthenticated && hasMembershipInCurrentCommunity;

  let initialState: AuthenticationState = "loading";
  if (ssrCurrentUser && ssrLineAuthenticated && isFullyRegistered) {
    initialState = "user_registered";
  } else if (ssrCurrentUser && ssrLineAuthenticated) {
    initialState = "line_authenticated";
  }

  logger.debug("[AUTH] applySsrAuthState", {
    initialState,
    ssrCurrentUser: !!ssrCurrentUser,
    ssrCurrentUserId: ssrCurrentUser?.id,
    ssrLineAuthenticated,
    ssrPhoneAuthenticated,
    communityId,
    hasMembershipInCurrentCommunity,
    isFullyRegistered,
    membershipIds: ssrCurrentUser?.memberships?.map(m => m.community?.id) ?? [],
  });

  useAuthStore.getState().setState({
    authenticationState: initialState,
    currentUser: ssrCurrentUser ?? null,
    isAuthenticating: false,
    isAuthInProgress: false,
  });
}
