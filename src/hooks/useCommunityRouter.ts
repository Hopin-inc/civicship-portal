"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { useCommunityId } from "@/contexts/CommunityContext";
import { prefixPath as prefixPathUtil, prefixStringPath, PrefixableHref } from "@/lib/communities/prefixPath";

interface NavigateOptions {
  scroll?: boolean;
}

export function useCommunityRouter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const communityId = useCommunityId();

  const prefixPath = useCallback(
    (path: PrefixableHref): PrefixableHref => {
      return prefixPathUtil(path, communityId);
    },
    [communityId],
  );

  const push = useCallback(
    (path: PrefixableHref, options?: NavigateOptions) => {
      const prefixedPath = prefixPath(path);
      router.push(prefixedPath, options);
    },
    [router, prefixPath],
  );

  const replace = useCallback(
    (path: PrefixableHref, options?: NavigateOptions) => {
      const prefixedPath = prefixPath(path);
      router.replace(prefixedPath, options);
    },
    [router, prefixPath],
  );

  const back = useCallback(() => {
    router.back();
  }, [router]);

  const forward = useCallback(() => {
    router.forward();
  }, [router]);

  const refresh = useCallback(() => {
    router.refresh();
  }, [router]);

  const currentPathWithoutCommunity = useMemo(() => {
    if (pathname.startsWith(`/${communityId}/`)) {
      return pathname.slice(communityId.length + 1);
    }
    if (pathname === `/${communityId}`) {
      return "/";
    }
    return pathname;
  }, [pathname, communityId]);

  return {
    push,
    replace,
    back,
    forward,
    refresh,
    prefixPath,
    pathname,
    currentPathWithoutCommunity,
    searchParams,
    communityId,
  };
}

export default useCommunityRouter;
