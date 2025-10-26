"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { logger } from "@/lib/logging";

let navigationCounter = 0;

/**
 * グローバルナビゲーションウォッチャー
 * すべてのページ遷移をログに記録して無限リダイレクトを検出
 */
export function NavigationWatcher() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const previousPathRef = useRef<string | null>(null);
  const mountTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    const currentPath = searchParams.size 
      ? `${pathname}?${searchParams.toString()}` 
      : pathname;
    
    const navId = ++navigationCounter;
    const elapsed = Date.now() - mountTimeRef.current;

    if (previousPathRef.current === null) {
      logger.info("[NAV] Initial mount", {
        component: "NavigationWatcher",
        navId,
        path: currentPath,
        elapsed: 0,
      });
    } else if (previousPathRef.current !== currentPath) {
      logger.info("[NAV] Navigation detected", {
        component: "NavigationWatcher",
        navId,
        from: previousPathRef.current,
        to: currentPath,
        elapsed,
      });
    }

    previousPathRef.current = currentPath;
  }, [pathname, searchParams]);

  return null;
}
