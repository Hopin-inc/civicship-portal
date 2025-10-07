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
  if (ssrCurrentUser) {
    initialState = "user_registered";
  } else if (ssrPhoneAuthenticated) {
    initialState = "phone_authenticated";
  } else if (ssrLineAuthenticated) {
    initialState = "line_authenticated";
  }

  useAuthStore.getState().setState({
    authenticationState: initialState,
    currentUser: ssrCurrentUser ?? null,
    isAuthenticating: false,
    isAuthInProgress: false,
  });
}
