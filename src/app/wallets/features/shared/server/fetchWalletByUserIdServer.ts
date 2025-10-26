import "server-only";

import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import { GqlWallet } from "@/types/graphql";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { logger } from "@/lib/logging";

interface UserWalletData {
  user: {
    id: string;
    wallets: GqlWallet[];
  };
}

export async function fetchWalletByUserIdServer(
  userId: string,
  session?: string
): Promise<GqlWallet | null> {
  try {
    const headers = session ? { Authorization: `Bearer ${session}` } : {};

    const data = await executeServerGraphQLQuery<UserWalletData>(
      `query GetUserWallet($id: ID!) {
        user(id: $id) {
          id
          wallets {
            id
            type
            currentPointView {
              currentPoint
            }
            accumulatedPointView {
              accumulatedPoint
            }
            tickets {
              id
              status
            }
            user {
              id
              name
              image
            }
            community {
              id
              name
            }
          }
        }
      }`,
      { id: userId },
      headers
    );

    const wallet = data.user?.wallets?.find(
      (w) => w.community?.id === COMMUNITY_ID
    );

    return wallet ?? null;
  } catch (error) {
    logger.error("Failed to fetch wallet by user ID (SSR)", {
      userId,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}
