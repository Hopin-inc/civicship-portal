/**
 * Edge-safe community ID utilities.
 * This file must NOT import any server-only modules as it's used in middleware.
 */

/**
 * List of valid community IDs.
 * This is the single source of truth for community validation.
 */
export const VALID_COMMUNITY_IDS = [
  "neo88",
  "kibotcha",
  "dais",
  "kotohira",
  "himeji-ymca",
  "izu",
] as const;

/**
 * Type representing a valid community ID.
 */
export type CommunityId = (typeof VALID_COMMUNITY_IDS)[number];

/**
 * Check if a string is a valid community ID.
 * This function is safe to use in Edge Runtime (middleware).
 */
export function isValidCommunityId(communityId: string): communityId is CommunityId {
  return VALID_COMMUNITY_IDS.includes(communityId as CommunityId);
}

/**
 * Extract communityId from a URL pathname.
 * Returns null if the first segment is not a valid community ID.
 */
export function extractCommunityIdFromPath(pathname: string): CommunityId | null {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) {
    return null;
  }
  const potentialCommunityId = segments[0];
  if (isValidCommunityId(potentialCommunityId)) {
    return potentialCommunityId;
  }
  return null;
}

/**
 * Get the communityId at runtime from URL path or cookie.
 * This is for browser-side use only.
 * Priority: URL path > cookie > environment variable > "default"
 */
/**
 * Strip the community ID prefix from a pathname.
 * Returns the path without the community prefix.
 * e.g., "/neo88/users/me" -> "/users/me"
 * e.g., "/users/me" -> "/users/me" (no change if no prefix)
 */
export function stripCommunityPrefix(pathname: string): string {
  const communityId = extractCommunityIdFromPath(pathname);
  if (!communityId) {
    return pathname;
  }
  // Remove the community prefix (e.g., "/neo88/users/me" -> "/users/me")
  const withoutPrefix = pathname.slice(`/${communityId}`.length);
  // Ensure the path starts with "/" or return "/" if empty
  return withoutPrefix || "/";
}

/**
 * Add community prefix to a path if not already present.
 * e.g., "/users/me" with communityId "neo88" -> "/neo88/users/me"
 * e.g., "/neo88/users/me" with communityId "neo88" -> "/neo88/users/me" (no change)
 */
export function addCommunityPrefix(pathname: string, communityId: string): string {
  const existingCommunityId = extractCommunityIdFromPath(pathname);
  if (existingCommunityId) {
    // Already has a community prefix
    return pathname;
  }
  // Add the community prefix
  return `/${communityId}${pathname === "/" ? "" : pathname}`;
}

export function getRuntimeCommunityId(): string {
  if (typeof window === "undefined") {
    // Server-side: return env var or default
    return process.env.NEXT_PUBLIC_COMMUNITY_ID || "default";
  }

  // Browser-side: check URL path first
  const pathCommunityId = extractCommunityIdFromPath(window.location.pathname);
  if (pathCommunityId) {
    return pathCommunityId;
  }

  // Fallback to cookie
  const cookieMatch = document.cookie.match(/(?:^|;\s*)communityId=([^;]*)/);
  if (cookieMatch && cookieMatch[1]) {
    const cookieCommunityId = cookieMatch[1];
    if (isValidCommunityId(cookieCommunityId)) {
      return cookieCommunityId;
    }
  }

  // Fallback to environment variable or default
  return process.env.NEXT_PUBLIC_COMMUNITY_ID || "default";
}
