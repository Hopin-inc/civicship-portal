import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { GqlTransactionsConnection, GqlWalletType, useGetTransactionsQuery } from "@/types/graphql";

export interface UseCommunityTransactionsResult {
  connection: GqlTransactionsConnection;
  loading: boolean;
  error: any;
  loadMoreRef: React.RefObject<HTMLDivElement>;
  refetch: () => void;
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

const useCommunityTransactions = (): UseCommunityTransactionsResult => {
  const { data, loading, error, fetchMore, refetch } = useGetTransactionsQuery({
    variables: {
      filter: {
        communityId: COMMUNITY_ID,
        or: [
          { fromWalletType: GqlWalletType.Community },
          { toWalletType: GqlWalletType.Community },
        ],
      },
      first: 100,
      withDidIssuanceRequests: true,
    },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  const connection = data?.transactions ?? fallbackConnection;
  const endCursor = connection.pageInfo?.endCursor;
  const hasNextPage = connection.pageInfo?.hasNextPage ?? false;

  const handleFetchMore = async () => {
    if (!hasNextPage) return;

    await fetchMore({
      variables: {
        filter: {
          communityId: COMMUNITY_ID,
          or: [
            { fromWalletType: GqlWalletType.Community },
            { toWalletType: GqlWalletType.Community },
          ],
        },
        after: endCursor,
        first: 100,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult || !prev.transactions) return prev;

        const prevEdges = prev.transactions.edges ?? [];
        const newEdges = fetchMoreResult.transactions?.edges ?? [];

        // 明示的に重複除去（重要！）
        const existingIds = new Set(prevEdges.map((e) => e?.node?.id));
        const dedupedNewEdges = newEdges.filter((e) => e?.node?.id && !existingIds.has(e.node.id));

        return {
          ...prev,
          transactions: {
            ...prev.transactions,
            edges: [...prevEdges, ...dedupedNewEdges],
            pageInfo: fetchMoreResult.transactions.pageInfo,
          },
        };
      },
    });
  };

  const loadMoreRef = useInfiniteScroll({
    hasMore: hasNextPage,
    isLoading: loading,
    onLoadMore: handleFetchMore,
  });

  return {
    connection,
    loading,
    error,
    loadMoreRef,
    refetch,
  };
};

export default useCommunityTransactions;
