import "server-only";

import { cookies } from "next/headers";

/**
 * Check if a session cookie exists (supports both "session" and "__session" names)
 * @returns Promise<boolean> - true if a session cookie exists
 */
export async function hasServerSession(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.has("session") || cookieStore.has("__session");
}

/**
 * Get the cookie header string for forwarding to API requests
 * @returns Promise<string> - cookie header string
 */
export async function getServerCookieHeader(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore.toString();
}
