import fs from "fs";
import path from "path";
import { getCommunityIdFromEnv } from "./metadata";

interface CommunityContent {
  termsFile: string;
  noticeItems: string[];
}

const COMMUNITY_CONTENT: Record<string, CommunityContent> = {
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
      "申し込みと同時に予約が確定します。",
      "「お手伝い」はポイントが貰えます。現地で参加確認後に主催者から付与いたします。",
      "「体験」はポイントのみで交換できます（現金では支払いができません）予約の上、現地でポイントと交換してください。",
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

export function getTermsContent(): string {
  const communityId = getCommunityIdFromEnv();
  const content = COMMUNITY_CONTENT[communityId];

  if (!content || !content.termsFile) {
    console.warn(
      `Terms content for community "${communityId}" is not configured. Using default terms.`,
    );
    const defaultTermsFile = COMMUNITY_CONTENT.default.termsFile;
    const termsPath = path.join(
      process.cwd(),
      "src",
      "lib",
      "communities",
      "terms",
      defaultTermsFile,
    );
    return fs.readFileSync(termsPath, "utf-8");
  }

  const termsPath = path.join(
    process.cwd(),
    "src",
    "lib",
    "communities",
    "terms",
    content.termsFile,
  );
  return fs.readFileSync(termsPath, "utf-8");
}

// 現在のコミュニティの注意事項を取得する関数
export function getNoticeItems(): string[] {
  const communityId = getCommunityIdFromEnv();
  const content = COMMUNITY_CONTENT[communityId];

  if (!content || !content.noticeItems) {
    console.warn(
      `Notice items for community "${communityId}" are not configured. Using default notice items.`,
    );
    return COMMUNITY_CONTENT.default.noticeItems;
  }

  return content.noticeItems;
}
