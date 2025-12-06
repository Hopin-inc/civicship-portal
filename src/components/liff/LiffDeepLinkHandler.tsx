"use client";

import { useLiffDeepLinkHandler } from "@/hooks/liff/useLiffDeepLinkHandler";

/**
 * Client component wrapper for LIFF deep-link handling.
 * 
 * This component should be mounted at the root level of the application
 * to ensure LIFF deep-links are processed correctly.
 */
export const LiffDeepLinkHandler = () => {
  useLiffDeepLinkHandler();
  return null;
};
