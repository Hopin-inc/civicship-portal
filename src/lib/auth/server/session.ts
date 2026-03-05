import "server-only";

import { cookies } from "next/headers";

/**
 * Check if a session cookie exists.
 * Supports legacy format ("session", "__session") and
 * community-scoped format ("__session_{communityId}") issued by the backend.
 * @returns Promise<boolean> - true if a session cookie exists
 */
export async function hasServerSession(): Promise<boolean> {
  const cookieStore = await cookies();
  if (cookieStore.has("session") || cookieStore.has("__session")) {
    return true;
  }
  return cookieStore.getAll().some((cookie) => cookie.name.startsWith("__session_"));
}

/**
 * Get the cookie header string for forwarding to API requests
 * @returns Promise<string> - cookie header string
 */
export async function getServerCookieHeader(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore.toString();
}
