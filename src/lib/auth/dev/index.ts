/**
 * Dev-only auto login.
 *
 * On a non-production deployment this lets a tester land on the portal already
 * signed in as a real, community-joined user — no LINE account, no Firebase.
 * The middleware provisions a throwaway user on the first page view and drops a
 * token cookie; from then on every request (SSR via the forwarded cookie, CSR
 * via the header) authenticates as that user.
 *
 * Needs no configuration. Both sides decide from the deployment identity they
 * already carry: this one from the `ENV` the dev build is stamped with, and
 * civicship-api independently from its own. Neither trusts the other's gate, and
 * neither has a flag or a shared secret to set.
 */

import { isLocal, isStaging } from "@/lib/environment";
import { DEV_AUTH_COOKIE_NAME } from "@/lib/auth/dev/constants";

export {
  DEV_AUTH_COOKIE_NAME,
  DEV_AUTH_HEADER_NAME,
  devAuthCookieOptions,
} from "@/lib/auth/dev/constants";

/**
 * Whether this build is a dev deployment.
 *
 * Stated positively rather than as `!isProduction` so that it is fail-closed: a
 * build has to actively identify itself as staging or local to qualify, and
 * anything unrecognised — including a production build — does not. The dev deploy
 * workflow stamps `ENV=staging`; the prod one passes no `ENV` at all.
 */
export function isDevLoginEnabled(): boolean {
  return isStaging || isLocal;
}

/** Budget for the provisioning call, which blocks the first page render. */
const DEV_SESSION_TIMEOUT_MS = 3000;

export interface DevSession {
  devToken: string;
  user: { id: string; name: string; uid: string };
}

/**
 * Asks civicship-api for a dev session, provisioning a fresh throwaway user.
 *
 * Returns null on any failure. A dev convenience must never be able to take the
 * portal down: if the API is unreachable or has dev login switched off, the
 * caller simply carries on unauthenticated.
 */
export async function requestDevSession(communityId: string): Promise<DevSession | null> {
  const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
  if (!apiEndpoint) return null;

  const apiBase = apiEndpoint.replace(/\/graphql\/?$/, "");

  // This call sits in middleware, so it blocks the first page render. Bound it:
  // a slow or hung API must cost a couple of seconds and a logged-out render,
  // never an unbounded stall on every visitor's first request.
  const abort = new AbortController();
  const timeout = setTimeout(() => abort.abort(), DEV_SESSION_TIMEOUT_MS);

  try {
    const res = await fetch(`${apiBase}/dev-auth/session`, {
      signal: abort.signal,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Community-Id": communityId,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.warn("[devLogin] API refused dev session", {
        status: res.status,
        communityId,
      });
      return null;
    }

    const data = (await res.json()) as DevSession;
    if (!data?.devToken) return null;
    return data;
  } catch (error) {
    console.warn("[devLogin] Failed to reach dev-auth endpoint", {
      communityId,
      timedOut: abort.signal.aborted,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Returns the request's cookie header with the dev token set to `token`,
 * dropping any existing value for it.
 *
 * Used to make a freshly provisioned session visible to the current request's
 * SSR. On a community switch the header still carries the previous community's
 * token, and leaving both in would depend on which one the API's parser keeps.
 */
export function withDevAuthCookie(existingCookieHeader: string | null, token: string): string {
  const kept = (existingCookieHeader ?? "")
    .split(";")
    .map((part) => part.trim())
    .filter((part) => part && !part.startsWith(`${DEV_AUTH_COOKIE_NAME}=`));

  return [...kept, `${DEV_AUTH_COOKIE_NAME}=${token}`].join("; ");
}

/**
 * Whether the request reached the user over HTTPS.
 *
 * `nextUrl.protocol` alone is not enough: behind a TLS-terminating proxy — which
 * is how this is deployed — it reads `http:`, and the dev token cookie would then
 * be issued without `Secure` on an HTTPS site. `x-forwarded-proto` is safe to
 * trust for this one decision: spoofing it can only cause the cookie to be marked
 * Secure when it need not be, which is the harmless direction.
 */
export function isSecureRequest(protocol: string, headers: Headers): boolean {
  if (protocol === "https:") return true;

  // The header can carry a client-to-proxy chain ("https,http"); the first hop is the client's.
  const forwarded = headers.get("x-forwarded-proto")?.split(",")[0]?.trim().toLowerCase();
  return forwarded === "https";
}

/**
 * True for requests where auto-provisioning a user is appropriate: a real page
 * navigation, not an RSC payload or a router prefetch.
 *
 * Without this, the several parallel RSC requests a single navigation fires would
 * each race to provision before the cookie lands, littering the dev DB with users.
 */
export function isDocumentNavigation(headers: Headers): boolean {
  if (headers.get("next-router-prefetch")) return false;
  if (headers.get("rsc")) return false;

  const mode = headers.get("sec-fetch-mode");
  // Older browsers omit Sec-Fetch-Mode; treat only an explicit non-navigate as a skip.
  return mode === null || mode === "navigate";
}

/**
 * True when the request is a top-level navigation the user initiated on this
 * site — typing the URL, or following a link from the portal itself.
 *
 * Distinct from isDocumentNavigation, which only asks "is this a page load".
 * This one also pins the *origin*, so a cross-site embed cannot trigger the
 * request at all. That is what keeps GET /api/dev-login/reset from doubling as
 * a logout anyone can fire from an <img> tag on another site.
 */
export function isSameOriginNavigation(headers: Headers): boolean {
  const site = headers.get("sec-fetch-site");
  const mode = headers.get("sec-fetch-mode");

  // Browsers that send neither header cannot be checked; the dev-only blast
  // radius of clearing a throwaway session does not justify locking them out.
  if (site === null && mode === null) return true;

  const originOk = site === null || site === "same-origin" || site === "none";
  const modeOk = mode === null || mode === "navigate";
  return originOk && modeOk;
}
