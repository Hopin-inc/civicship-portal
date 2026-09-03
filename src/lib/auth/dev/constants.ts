/**
 * Shared names for the dev auto-login token.
 *
 * Kept free of any server-only logic so client bundles (the Apollo link) can
 * import it without dragging in DEV_LOGIN_SECRET handling.
 */

/** Readable by client JS on purpose — the browser-side Apollo link forwards it as a header. */
export const DEV_AUTH_COOKIE_NAME = "dev_auth_token";

export const DEV_AUTH_HEADER_NAME = "x-dev-auth-token";

/** Matches DEV_TOKEN_TTL_MS in civicship-api. */
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
