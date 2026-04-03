"use client";

import { useCommunityConfig } from "@/contexts/CommunityConfigContext";

export function useReceiveUrl(userId: string): { url: string } {
  const communityConfig = useCommunityConfig();
  const communityId = communityConfig?.communityId ?? "";

  if (typeof window === "undefined" || !userId || !communityId) {
    return { url: "" };
  }

  const url = `${window.location.origin}/community/${communityId}/wallets/donate?recipientId=${userId}`;
  return { url };
}
