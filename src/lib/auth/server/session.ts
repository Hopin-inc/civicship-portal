import "server-only";

import { cookies } from "next/headers";

/**
 * Check if a session cookie exists
 * Supports legacy names ("session", "__session") and tenanted names ("__session_{communityId}")
 * @returns Promise<boolean> - true if a session cookie exists
 */
export async function hasServerSession(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.getAll().some(
    (cookie) =>
      cookie.name === "session" ||
      cookie.name === "__session" ||
      cookie.name.startsWith("__session_"),
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
