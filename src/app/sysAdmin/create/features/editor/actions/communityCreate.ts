"use server";

import { cookies } from "next/headers";
import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import { ACTIVE_COMMUNITY_IDS } from "@/lib/communities/constants";

const COMMUNITY_CREATE_MUTATION = `
  mutation CommunityCreate($input: CommunityCreateInput!) {
    communityCreate(input: $input) {
      ... on CommunityCreateSuccess {
        community {
          id
          name
          image
        }
      }
    }
  }
`;

interface CommunityCreateServerInput {
  name: string;
  originalId?: string;
  lineAccessToken: string;
  lineChannelId: string;
  lineChannelSecret: string;
  lineLiffId: string;
}

interface CommunityCreateServerResult {
  communityId?: string;
  error?: string;
}

type CommunityCreateResponse = {
  communityCreate?: {
    community?: {
      id: string;
      name: string;
      image?: string;
    };
  };
};

// LIFF ID の形式: {数字}-{英数字}（例: 2009756673-s2ldhFgl）
const LIFF_ID_PATTERN = /^\d+-[A-Za-z0-9]+$/;

export async function createCommunityAction(
  input: CommunityCreateServerInput,
): Promise<CommunityCreateServerResult> {
  // LIFF ID 形式バリデーション
  if (!LIFF_ID_PATTERN.test(input.lineLiffId)) {
    return { error: "LIFF ID の形式が正しくありません（例: 2009756673-s2ldhFgl）" };
  }

  // __session_{communityId} cookie からセッションが有効なコミュニティIDを取得し
  // X-Community-Id として明示的に渡す。
  // auto-resolve に任せると middleware が cookie の stale な communityId（削除済み等）を
  // ヘッダーにセットしてしまい、バックエンドの Firebase テナント検索が失敗するため。
  const cookieStore = await cookies();
  const authCommunityId = cookieStore
    .getAll()
    .filter((c) => c.name.startsWith("__session_"))
    .map((c) => c.name.replace("__session_", ""))
    .find((id) => (ACTIVE_COMMUNITY_IDS as readonly string[]).includes(id)) ?? "";

  if (!authCommunityId) {
    return { error: "有効なセッションが見つかりません。いずれかのコミュニティにログインしてから再試行してください" };
  }

  try {
    const data = await executeServerGraphQLQuery<
      CommunityCreateResponse,
      { input: object }
    >(
      COMMUNITY_CREATE_MUTATION,
      {
        input: {
          name: input.name,
          pointName: "pt",
          originalId: input.originalId || undefined,
          config: {
            lineConfig: {
              accessToken: input.lineAccessToken,
              channelId: input.lineChannelId,
              channelSecret: input.lineChannelSecret,
              // liffAppId はフル形式（例: 2009756673-s2ldhFgl）
              // liffId は数字部分のみ（例: 2009756673）
              liffAppId: input.lineLiffId,
              liffId: input.lineLiffId.split("-")[0],
              liffBaseUrl: `https://liff.line.me/${input.lineLiffId}`,
              richMenus: [],
            },
          },
        },
      },
      { "X-Community-Id": authCommunityId },
      30000,
    );

    const community = data?.communityCreate?.community;
    if (!community?.id) {
      return { error: "コミュニティの作成に失敗しました" };
    }

    return { communityId: community.id };
  } catch (error) {
    console.error("[createCommunityAction] Error:", error);
    return {
      error: error instanceof Error ? error.message : "コミュニティの作成に失敗しました",
    };
  }
}
