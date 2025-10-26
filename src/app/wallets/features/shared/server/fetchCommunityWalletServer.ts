import "server-only";

import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import { GqlWallet } from "@/types/graphql";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { logger } from "@/lib/logging";

interface CommunityWalletData {
  wallets: {
    edges: Array<{
      node: GqlWallet;
    }>;
  };
}

export async function fetchCommunityWalletServer(): Promise<GqlWallet | null> {
  try {
    const data = await executeServerGraphQLQuery<CommunityWalletData>(
      `query GetCommunityWallet($communityId: ID!) {
        wallets(filter: { type: COMMUNITY, communityId: $communityId }) {
          edges {
            node {
              id
              type
              currentPointView {
                currentPoint
              }
              accumulatedPointView {
                accumulatedPoint
              }
              community {
                id
                name
              }
            }
          }
        }
      }`,
      { communityId: COMMUNITY_ID }
    );

    return data.wallets?.edges?.[0]?.node ?? null;
  } catch (error) {
    logger.error("Failed to fetch community wallet (SSR)", {
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}
