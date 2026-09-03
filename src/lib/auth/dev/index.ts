/**
 * Dev-only auto login.
 *
 * On a non-production deployment this lets a tester land on the portal already
 * signed in as a real, community-joined user — no LINE account, no Firebase.
 * The middleware provisions a throwaway user on the first page view and drops a
 * token cookie; from then on every request (SSR via the forwarded cookie, CSR
 * via the header) authenticates as that user.
 *
 * Gated identically on both sides. The portal will not even attempt this unless
 * DEV_LOGIN_ENABLED is "true", the build is not production, and DEV_LOGIN_SECRET
 * is present — and civicship-api independently refuses to mint or honour a token
 * unless its own three gates hold. Neither side trusts the other's gating.
 */

import { isProduction } from "@/lib/environment";
import { DEV_AUTH_COOKIE_NAME } from "@/lib/auth/dev/constants";

export {
  DEV_AUTH_COOKIE_NAME,
  DEV_AUTH_HEADER_NAME,
  devAuthCookieOptions,
} from "@/lib/auth/dev/constants";

/**
 * Server-side only — DEV_LOGIN_SECRET is deliberately not NEXT_PUBLIC, so the
 * shared secret never reaches the browser. Client code decides what to do purely
 * from the presence of the cookie.
 */
export function isDevLoginEnabled(): boolean {
  return (
    !isProduction &&
    process.env.DEV_LOGIN_ENABLED === "true" &&
    !!process.env.DEV_LOGIN_SECRET
  );
}

/** Budget for the provisioning call, which blocks the first page render. */
const DEV_SESSION_TIMEOUT_MS = 3000;

export interface DevSession {
  devToken: string;
  user: { id: string; name: string; uid: string };
  provisioned: boolean;
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
  const secret = process.env.DEV_LOGIN_SECRET;
  if (!apiEndpoint || !secret) return null;

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
        "x-dev-login-secret": secret,
      },
      body: JSON.stringify({}),
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
 * True for requests where auto-provisioning a user is appropriate: a real page
 * navigation, not an RSC payload or a router prefetch.
 *
 * Without this, the several parallel RSC requests a single navigation fires would
 * each race to provision before the cookie lands, littering the dev DB with users.
 */
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

export function isDocumentNavigation(headers: Headers): boolean {
  if (headers.get("next-router-prefetch")) return false;
  if (headers.get("rsc")) return false;

  const mode = headers.get("sec-fetch-mode");
  // Older browsers omit Sec-Fetch-Mode; treat only an explicit non-navigate as a skip.
  return mode === null || mode === "navigate";
}
