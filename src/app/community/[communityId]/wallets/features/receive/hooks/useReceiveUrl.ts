"use client";

import { useCommunityConfig } from "@/contexts/CommunityConfigContext";

export function useReceiveUrl(userId: string): { url: string } {
  const communityConfig = useCommunityConfig();
  const communityId = communityConfig?.communityId ?? "";
  const liffBaseUrl = communityConfig?.liffBaseUrl;

  if (typeof window === "undefined" || !userId || !communityId) {
    return { url: "" };
  }

  const donatePath = `/wallets/donate?recipientId=${encodeURIComponent(userId)}`;

  const url = liffBaseUrl
    ? `${liffBaseUrl}?liff.state=${encodeURIComponent(donatePath)}`
    : `${window.location.origin}/community/${encodeURIComponent(communityId)}${donatePath}`;

  return { url };
}
