import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import { GET_COMMUNITY_WALLET_SERVER_QUERY } from "@/graphql/account/wallet/server";
import { getServerWalletTransactions } from "@/hooks/transactions/server-wallet-transactions";
import { getCommunityIdFromHeader } from "@/lib/community/get-community-id-server";
import { GqlTransactionsConnection } from "@/types/graphql";
import { toPointNumber } from "@/utils/bigint";
import { logger } from "@/lib/logging";

export interface CommunityWalletWithTransactionsResult {
  wallet: { id: string; currentPoint: number } | null;
  transactions: GqlTransactionsConnection;
}

const fallbackConnection: GqlTransactionsConnection = {
  edges: [],
  pageInfo: {
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor: null,
    endCursor: null,
  },
  totalCount: 0,
};

export async function getServerCommunityWalletWithTransactions(
  params: { first?: number } = {},
): Promise<CommunityWalletWithTransactionsResult> {
  const communityId = await getCommunityIdFromHeader();
  if (!communityId) {
    return { wallet: null, transactions: fallbackConnection };
  }

  const { first = 20 } = params;

  try {
    // ウォレット取得が先に必要（transactions フィルターに wallet ID を使うため逐次実行）
    const walletData = await executeServerGraphQLQuery<{
      wallets: {
        edges: Array<{
          node: {
            id: string;
            currentPointView: { currentPoint: string } | null;
            community: { id: string } | null;
          };
        } | null> | null;
      } | null;
    }>(GET_COMMUNITY_WALLET_SERVER_QUERY, { communityId });

    const walletNode = walletData.wallets?.edges?.[0]?.node;
    if (!walletNode) {
      return { wallet: null, transactions: fallbackConnection };
    }

    // wallet ID で絞り込むことで fetchMoreWalletTransactions（ページネーション）と同じフィルターになる
    const transactions = await getServerWalletTransactions({
      walletId: walletNode.id,
      first,
      withDidIssuanceRequests: true,
    });

    return {
      wallet: {
        id: walletNode.id,
        currentPoint: toPointNumber(walletNode.currentPointView?.currentPoint, 0),
      },
      transactions,
    };
  } catch (error) {
    logger.error("Failed to fetch community wallet with transactions:", { error });
    return { wallet: null, transactions: fallbackConnection };
  }
}
