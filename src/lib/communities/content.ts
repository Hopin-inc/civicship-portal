interface CommunityContent {
  termsFile: string;
  noticeItems: string[];
}

export const COMMUNITY_CONTENT: Record<string, CommunityContent> = {
  neo88: {
    noticeItems: [
      "ホストによる確認後に、予約が確定します。",
      "実施確定または中止のどちらの場合でも、公式LINEからご連絡します。",
      "当日は現金をご用意下さい。",
      "キャンセルは開催日の前日まで可能です。",
    ],
    termsFile: "default.md",
  },
  kotohira: {
    noticeItems: [
      "主催者の承認後に予約が確定します。",
      "「お手伝い」はポイントが貰えます。現地で参加確認後に主催者から付与いたします。",
      "「体験」はポイントのみで交換できます（現金では支払いができません）予約と同時にポイント利用となります。",
      "キャンセルは開催日の前日まで可能です。",
    ],
    termsFile: "default.md",
  },
  default: {
    noticeItems: [
      "ホストによる確認後に、予約が確定します。",
      "実施確定または中止のどちらの場合でも、公式LINEからご連絡します。",
      "当日は現金をご用意下さい。",
      "キャンセルは開催日の前日まで可能です。",
    ],
    termsFile: "default.md",
  },
};

/**
 * Get notice items for a specific community
 * @param communityId - Community ID from URL path parameter (required for multi-tenant routing)
 */
export function getNoticeItems(communityId: string): string[] {
  const content = COMMUNITY_CONTENT[communityId];

  if (!content || !content.noticeItems) {
    console.warn(
      `Notice items for community "${communityId}" are not configured. Using default notice items.`,
    );
    return COMMUNITY_CONTENT.default.noticeItems;
  }

  return content.noticeItems;
}
