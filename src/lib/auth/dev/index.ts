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

export {
  DEV_AUTH_COOKIE_NAME,
  DEV_AUTH_COOKIE_OPTIONS,
  DEV_AUTH_HEADER_NAME,
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

  try {
    const res = await fetch(`${apiBase}/dev-auth/session`, {
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
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
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
