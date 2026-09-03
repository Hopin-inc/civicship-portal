import { NextRequest, NextResponse } from "next/server";
import { DEV_AUTH_COOKIE_NAME } from "@/lib/auth/dev/constants";
import { isDevLoginEnabled } from "@/lib/auth/dev";

/**
 * GET /api/dev-login/reset
 *
 * Drops the dev auto-login cookie and bounces back to the app, where the
 * middleware provisions a brand-new throwaway user. This is how a tester starts
 * over from a clean account — visiting it in the address bar is the whole flow.
 *
 * 404s unless dev login is enabled, so it does not exist in production.
 */
export async function GET(request: NextRequest) {
  if (!isDevLoginEnabled()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Only same-origin paths, so this cannot be used as an open redirect.
  const requested = request.nextUrl.searchParams.get("next");
  const next = requested && requested.startsWith("/") && !requested.startsWith("//") ? requested : "/";

  const response = NextResponse.redirect(new URL(next, request.url));
  response.cookies.set(DEV_AUTH_COOKIE_NAME, "", { path: "/", expires: new Date(0) });
  return response;
}
