"use server";

import { executeServerGraphQLQuery } from "@/lib/graphql/server";

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

export async function createCommunityAction(
  input: CommunityCreateServerInput,
): Promise<CommunityCreateServerResult> {
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
