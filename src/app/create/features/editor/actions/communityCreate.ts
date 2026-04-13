"use server";

import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import { getUserServer } from "@/lib/auth/init/getUserServer";

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
  // 権限チェック: SYS_ADMIN のみ実行可能
  const { user } = await getUserServer();
  if (!user || user.sysRole !== "SYS_ADMIN") {
    return { error: "この操作を実行する権限がありません" };
  }

  // LIFF ID 形式バリデーション
  if (!LIFF_ID_PATTERN.test(input.lineLiffId)) {
    return { error: "LIFF ID の形式が正しくありません（例: 2009756673-s2ldhFgl）" };
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
      {},
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
