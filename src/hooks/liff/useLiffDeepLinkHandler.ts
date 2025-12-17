"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { logger } from "@/lib/logging";

/**
 * Handles LIFF deep-linking by consuming the liff.state query parameter.
 * 
 * When LIFF launches the app, it typically starts at the configured endpoint URL (usually "/")
 * and passes the intended target path in the "liff.state" query parameter.
 * 
 * This hook reads that parameter and navigates to the intended path, enabling deep-linking
 * functionality in LIFF environments.
 * 
 * @example
 * // In a root layout or top-level component:
 * useLiffDeepLinkHandler();
 */
export const useLiffDeepLinkHandler = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const hasProcessedRef = useRef(false);

  useEffect(() => {
    // Skip on server-side rendering
    if (typeof window === "undefined") return;

    // Only process once
    if (hasProcessedRef.current) return;

    // Only handle root path to avoid interfering with other pages that might use liff.state
    // (e.g., sign-up/phone-verification uses it as a fallback for "next" parameter)
    if (pathname !== "/") return;

    // Get the liff.state parameter
    const liffState = searchParams.get("liff.state");

    // Skip if no liff.state or if it's just "/"
    if (!liffState || liffState === "/") return;

    // Security check: only allow internal paths
    if (!liffState.startsWith("/") || liffState.startsWith("//")) {
      logger.warn("[AUTH-LIFF] Invalid liff.state parameter", {
        liffState,
        component: "useLiffDeepLinkHandler",
      });
      return;
    }

    logger.debug("[AUTH-LIFF] Processing LIFF deep link", {
      liffState,
      component: "useLiffDeepLinkHandler",
    });

    // Mark as processed to prevent re-processing
    hasProcessedRef.current = true;

    // Navigate to the target path (this will automatically remove the liff.state parameter)
    router.replace(liffState);
  }, [pathname, searchParams, router]);
};
