/**
 * Shared names for the dev auto-login token.
 *
 * Kept free of any server-only logic so client bundles (the Apollo link) can
 * import it without dragging in the middleware's provisioning code.
 */

/** Readable by client JS on purpose — the browser-side Apollo link forwards it as a header. */
export const DEV_AUTH_COOKIE_NAME = "dev_auth_token";

export const DEV_AUTH_HEADER_NAME = "x-dev-auth-token";

/**
 * Reads the dev auto-login token from the browser's cookies.
 *
 * Returns null on the server, where there is no `document`. Absent — and
 * therefore a no-op — on any deployment where dev login is not enabled, since
 * nothing sets the cookie there.
 */
export function readDevAuthToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${DEV_AUTH_COOKIE_NAME}=([^;]*)`));
  if (!match) return null;

  try {
    return decodeURIComponent(match[1]);
  } catch {
    // A malformed percent-escape makes decodeURIComponent throw. A corrupt dev
    // cookie must not take out every GraphQL request in the app, so fall back to
    // the raw value and let the API reject it as an invalid token.
    return match[1] || null;
  }
}

/**
 * Cookie lifetime, in **seconds** — that is what `Set-Cookie: Max-Age` takes.
 *
 * Deliberately the same 12 hours as `DEV_TOKEN_TTL_MS` in civicship-api, which
 * expresses it in milliseconds. Keeping the cookie no longer than the token it
 * carries means the browser drops it around when the api would start rejecting
 * it, instead of sending a dead token and rendering logged out.
 */
const DEV_AUTH_COOKIE_MAX_AGE_SECONDS = 12 * 60 * 60;

/**
 * Cookie options for the dev auto-login token.
 *
 * `secure` follows the scheme rather than being hardcoded: a deployed dev
 * environment is HTTPS and the token must never travel in the clear there, but
 * hardcoding it would stop the cookie from being set at all on a local http
 * server. `httpOnly` is deliberately false — the browser-side Apollo link has to
 * read this token to forward it as a header on cross-origin GraphQL requests.
 */
export function devAuthCookieOptions(secure: boolean) {
  return {
    path: "/",
    maxAge: DEV_AUTH_COOKIE_MAX_AGE_SECONDS,
    sameSite: "lax",
    httpOnly: false,
    secure,
  } as const;
}
