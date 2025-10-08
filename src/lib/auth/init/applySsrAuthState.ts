import { useAuthStore } from "@/lib/auth/core/auth-store";
import { AuthenticationState } from "@/types/auth";
import { GqlUser } from "@/types/graphql";

export function applySsrAuthState(
  ssrCurrentUser?: GqlUser | null,
  ssrLineAuthenticated?: boolean,
  ssrPhoneAuthenticated?: boolean,
) {
  if (!ssrLineAuthenticated && !ssrPhoneAuthenticated && !ssrCurrentUser) return;

  let initialState: AuthenticationState = "loading";
  if (ssrCurrentUser && ssrLineAuthenticated && ssrPhoneAuthenticated) {
    initialState = "user_registered";
  }

  useAuthStore.getState().setState({
    authenticationState: initialState,
    currentUser: ssrCurrentUser ?? null,
    isAuthenticating: false,
    isAuthInProgress: false,
  });
}
