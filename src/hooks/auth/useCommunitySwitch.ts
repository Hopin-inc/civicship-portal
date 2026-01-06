"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import { extractCommunityIdFromPath, setCurrentCommunityFirebaseTenantId } from "@/lib/communities/communityIds";
import { useAuthStore } from "@/lib/auth/core/auth-store";
import { TokenManager } from "@/lib/auth/core/token-manager";
import { lineAuth, getPhoneAuth } from "@/lib/auth/core/firebase-config";
import { logger } from "@/lib/logging";

/**
 * Hook that detects community changes during SPA navigation and resets auth state.
 * 
 * When a user navigates from community A to community B:
 * 1. Clears the current community's Firebase tenant ID (prevents wrong-tenant token usage)
 * 2. Signs out from Firebase (both LINE and Phone auth)
 * 3. Resets the Zustand auth store
 * 4. Clears auth cookies
 * 
 * This ensures that each community has its own isolated auth state.
 */
export function useCommunitySwitch(): void {
  const pathname = usePathname();
  const previousCommunityIdRef = useRef<string | null>(null);
  const isFirstRenderRef = useRef(true);

  useEffect(() => {
    const currentCommunityId = extractCommunityIdFromPath(pathname);
    
    // On first render, just store the current community ID
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      previousCommunityIdRef.current = currentCommunityId;
      return;
    }

    // Check if community has changed
    const previousCommunityId = previousCommunityIdRef.current;
    if (previousCommunityId && currentCommunityId && previousCommunityId !== currentCommunityId) {
      logger.info("[CommunitySwitch] Community changed, resetting auth state", {
        from: previousCommunityId,
        to: currentCommunityId,
      });

      // 1. Immediately clear the tenant ID to prevent wrong-tenant token usage
      setCurrentCommunityFirebaseTenantId(null);

      // 2. Reset Zustand auth store
      useAuthStore.getState().reset();

      // 3. Clear auth cookies for the old community
      TokenManager.clearAllAuthFlags();

      // 4. Sign out from Firebase (async, but we don't need to wait)
      (async () => {
        try {
          await signOut(lineAuth);
          logger.debug("[CommunitySwitch] Signed out from LINE Firebase auth");
        } catch (error) {
          logger.warn("[CommunitySwitch] Failed to sign out from LINE Firebase auth", { error });
        }

        try {
          const phoneAuth = getPhoneAuth();
          await signOut(phoneAuth);
          logger.debug("[CommunitySwitch] Signed out from Phone Firebase auth");
        } catch (error) {
          logger.warn("[CommunitySwitch] Failed to sign out from Phone Firebase auth", { error });
        }
      })();
    }

    // Update the previous community ID
    previousCommunityIdRef.current = currentCommunityId;
  }, [pathname]);
}
