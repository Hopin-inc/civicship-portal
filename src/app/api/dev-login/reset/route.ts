import { NextRequest, NextResponse } from "next/server";
import { DEV_AUTH_COOKIE_NAME, DEV_ROLE_COOKIE_NAME } from "@/lib/auth/dev/constants";
import { isDevLoginEnabled, isSameOriginNavigation, parseDevRole } from "@/lib/auth/dev";

/**
 * GET /api/dev-login/reset
 *
 * Drops the dev auto-login cookie and bounces back to the app, where the
 * middleware provisions a brand-new throwaway user. This is how a tester starts
 * over from a clean account — visiting it in the address bar is the whole flow.
 *
 * `?role=owner` (or `manager`) provisions the next user with that role instead of
 * a plain member, so the admin screens can be exercised. Switching back is the
 * same URL without the param, which is the point of making it per-reset rather
 * than a fixed setting: the member view is what most of the app renders, and its
 * permission-gated UI is what quietly breaks.
 *
 * `?next=/some/path` picks where to land afterwards.
 *
 * 404s unless dev login is enabled, so it does not exist in production.
 */
export async function GET(request: NextRequest) {
  if (!isDevLoginEnabled()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Clearing a cookie on GET is reachable cross-site — an <img> tag pointing here
  // would log the tester out from any page on the internet. Restrict it to a
  // top-level navigation the user made on this site.
  if (!isSameOriginNavigation(request.headers)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Only same-origin paths, so this cannot be used as an open redirect.
  const requested = request.nextUrl.searchParams.get("next");
  const next = requested && requested.startsWith("/") && !requested.startsWith("//") ? requested : "/";

  const response = NextResponse.redirect(new URL(next, request.url));
  response.cookies.set(DEV_AUTH_COOKIE_NAME, "", { path: "/", expires: new Date(0) });

  // Hand the requested role to the middleware, which provisions on the page load
  // this redirect lands on. Short-lived and single-use: the middleware clears it
  // as soon as it has been applied. An unrecognised value is dropped here rather
  // than forwarded, so a typo lands on the default instead of failing.
  const role = parseDevRole(request.nextUrl.searchParams.get("role"));
  if (role) {
    response.cookies.set(DEV_ROLE_COOKIE_NAME, role, {
      path: "/",
      maxAge: 60,
      sameSite: "lax",
      httpOnly: false,
    });
  }

  return response;
}
