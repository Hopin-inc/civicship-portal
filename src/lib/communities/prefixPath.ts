/**
 * Shared utility for prefixing paths with community ID.
 * Used by CommunityLink and useCommunityRouter.
 */

import type { LinkProps } from "next/link";

export type PrefixableHref = LinkProps["href"];

/**
 * Prefix a path or URL object with the community ID.
 * Handles strings, URL objects, and UrlObjects from Next.js.
 */
export function prefixPath(href: PrefixableHref, communityId: string): PrefixableHref {
  // Handle string paths
  if (typeof href === "string") {
    return prefixStringPath(href, communityId);
  }

  // Handle UrlObject (from Next.js Link)
  if (typeof href === "object" && href !== null) {
    // If it has a pathname, prefix it
    if (href.pathname) {
      const prefixedPathname = prefixStringPath(href.pathname, communityId);
      return { ...href, pathname: prefixedPathname };
    }
    // If no pathname, return as-is
    return href;
  }

  // Fallback: return as-is
  return href;
}

/**
 * Prefix a string path with the community ID.
 */
export function prefixStringPath(path: string, communityId: string): string {
  // Don't prefix external URLs
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // Don't prefix hash links
  if (path.startsWith("#")) {
    return path;
  }

  // Don't prefix if already prefixed with this community
  if (path.startsWith(`/${communityId}/`) || path === `/${communityId}`) {
    return path;
  }

  // Prefix absolute paths
  if (path.startsWith("/")) {
    return `/${communityId}${path}`;
  }

  // Prefix relative paths
  return `/${communityId}/${path}`;
}
