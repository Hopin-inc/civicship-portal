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
 * Carries the role the next provisioning should use, set by the reset route and
 * consumed once by the middleware.
 *
 * A cookie rather than a query param because the provisioning happens on a later
 * request than the one that asked for it: reset clears the session and bounces,
 * and the middleware provisions on the page load that follows.
 */
export const DEV_ROLE_COOKIE_NAME = "dev_login_role";

/** Roles a dev session can be provisioned with, matching the api's allow-list. */
export const DEV_ROLES = ["MEMBER", "MANAGER", "OWNER"] as const;

export type DevRole = (typeof DEV_ROLES)[number];

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
