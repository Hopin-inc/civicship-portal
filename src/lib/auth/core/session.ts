import { useEffect, useState } from "react";

import { useAuthStore } from "@/lib/auth/core/auth-store";
import { readDevAuthToken } from "@/lib/auth/dev/constants";
import type { AuthState } from "@/types/auth";

/**
 * Whether this session carries a credential the API will accept.
 *
 * There are three ways in — Firebase, LINE, and dev auto-login — and the third
 * goes through neither of the first two, by design: it has no Firebase user and
 * no LINE tokens, only its own cookie. A check naming just Firebase and LINE
 * therefore reads an entire dev session as unauthenticated, which is what left
 * the point buttons disabled on the development deployment and blocked the
 * mutation behind them. The Apollo link already accepts the dev token as one of
 * these signals; this is the same allowance, in the places that gate the UI.
 *
 * Only the dev login writes that cookie, so on a deployment where dev login is
 * off this answers exactly as the Firebase/LINE check did before.
 *
 * Read the cookie during an event handler, not during render — see
 * `useIsAuthenticatedSession` for the render-time form.
 */
export function isAuthenticatedSession(state: AuthState): boolean {
  return !!state.firebaseUser || !!state.lineTokens.idToken || !!readDevAuthToken();
}

/**
 * The same question for a control that has to re-render as credentials arrive.
 *
 * The provider tokens come from the store, which starts empty on both sides of
 * hydration and is filled by an effect. The dev cookie is read in an effect for
 * the same reason: reading it during render would answer `false` on the server
 * and `true` on the client, and the first client render has to match the markup
 * the server sent. The middleware sets the cookie on the response that carries
 * the page, so it is already there by the time the effect runs.
 */
export function useIsAuthenticatedSession(): boolean {
  const hasProviderAuth = useAuthStore(
    (s) => !!s.state.firebaseUser || !!s.state.lineTokens.idToken,
  );
  const [hasDevAuth, setHasDevAuth] = useState(false);

  useEffect(() => {
    setHasDevAuth(!!readDevAuthToken());
  }, []);

  return hasProviderAuth || hasDevAuth;
}
