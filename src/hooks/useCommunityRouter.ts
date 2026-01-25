"use client";

import { useRouter, useParams, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";

/**
 * useCommunityRouter is a wrapper around next/navigation's useRouter
 * that automatically prepends the current communityId to the destination path.
 */
export function useCommunityRouter() {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const communityId = params?.communityId as string | undefined;

  const buildHref = useCallback(
    (href: string) => {
      if (!communityId) {
        return href;
      }

      // Handle query-only navigation (e.g., "?tab=member")
      // In this case, preserve the current pathname and just update the query params
      if (href.startsWith("?")) {
        return `${pathname}${href}`;
      }

      // Skip if already has communityId prefix or is external/absolute URL
      if (
        href.startsWith(`/${communityId}`) ||
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("//")
      ) {
        return href;
      }

      // Ensure path starts with /
      const path = href.startsWith("/") ? href : `/${href}`;
      return `/${communityId}${path}`;
    },
    [communityId, pathname]
  );

  return useMemo(
    () => ({
      ...router,
      push: (href: string, options?: any) => {
        router.push(buildHref(href), options);
      },
      replace: (href: string, options?: any) => {
        router.replace(buildHref(href), options);
      },
      prefetch: (href: string, options?: any) => {
        router.prefetch(buildHref(href), options);
      },
    }),
    [router, buildHref]
  );
}
