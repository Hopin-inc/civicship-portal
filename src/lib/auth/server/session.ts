import "server-only";

import { cookies } from "next/headers";
import { DEV_AUTH_COOKIE_NAME } from "@/lib/auth/dev/constants";

/**
 * Check if a session cookie exists
 * Supports legacy names ("session", "__session") and tenanted names ("__session_{communityId}")
 * The dev auto-login token counts too: it authenticates SSR GraphQL requests the
 * same way, and without it getUserServer would short-circuit to "logged out".
 * @returns Promise<boolean> - true if a session cookie exists
 */
export async function hasServerSession(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.getAll().some(
    (cookie) =>
      cookie.name === "session" ||
      cookie.name === "__session" ||
      cookie.name.startsWith("__session_") ||
      cookie.name === DEV_AUTH_COOKIE_NAME,
  );
}

/**
 * Get the cookie header string for forwarding to API requests
 * @returns Promise<string> - cookie header string
 */
export async function getServerCookieHeader(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore.toString();
}
