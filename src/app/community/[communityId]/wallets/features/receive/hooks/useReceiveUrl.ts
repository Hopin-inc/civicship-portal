"use client";

import { useCommunityConfig } from "@/contexts/CommunityConfigContext";

/**
 * 受け取り QR のリンクで「送付先＝コミュニティ財布」を表す recipientId のセンチネル値。
 * donate 画面はこの値のとき、メンバー検索ではなくコミュニティを送付先に選択する。
 */
export const COMMUNITY_RECIPIENT_ID = "community";

/**
 * 受け取り用の donate ディープリンクを生成する。
 * recipientId には対象ユーザー ID、またはコミュニティ財布あての場合は
 * COMMUNITY_RECIPIENT_ID を渡す。
 */
function buildReceiveUrl(
  communityId: string,
  liffBaseUrl: string | null | undefined,
  recipientId: string,
): string {
  if (typeof window === "undefined" || !recipientId || !communityId) {
    return "";
  }

  const donatePath = `/wallets/donate?recipientId=${encodeURIComponent(recipientId)}`;

  return liffBaseUrl
    ? `${liffBaseUrl}?liff.state=${encodeURIComponent(donatePath)}`
    : `${window.location.origin}/community/${encodeURIComponent(communityId)}${donatePath}`;
}

export function useReceiveUrl(userId: string): { url: string } {
  const communityConfig = useCommunityConfig();
  const communityId = communityConfig?.communityId ?? "";
  const url = buildReceiveUrl(communityId, communityConfig?.liffBaseUrl, userId);
  return { url };
}

/** コミュニティ財布あての受け取り QR リンクを生成する (メンバーがコミュニティに送付するための導線)。 */
export function useCommunityReceiveUrl(): { url: string } {
  const communityConfig = useCommunityConfig();
  const communityId = communityConfig?.communityId ?? "";
  const url = buildReceiveUrl(communityId, communityConfig?.liffBaseUrl, COMMUNITY_RECIPIENT_ID);
  return { url };
}
