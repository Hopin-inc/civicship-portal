import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";
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
  // Use runtime communityId from CommunityConfigContext
  const communityConfig = useCommunityConfig();
  const communityId = communityConfig?.communityId || "";
  
  const { data, loading, error, fetchMore, refetch } = useGetTransactionsQuery({
    variables: {
      filter: {
        communityId: communityId,
        or: [
          { fromWalletType: GqlWalletType.Community },
          { toWalletType: GqlWalletType.Community },
        ],
      },
      first: 20,
      withDidIssuanceRequests: true,
    },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    skip: !communityId,
  });

  const connection = data?.transactions ?? fallbackConnection;
  const endCursor = connection.pageInfo?.endCursor;
  const hasNextPage = connection.pageInfo?.hasNextPage ?? false;

  const handleFetchMore = async () => {
    if (!hasNextPage || !communityId) return;

    await fetchMore({
      variables: {
        filter: {
          communityId: communityId,
          or: [
            { fromWalletType: GqlWalletType.Community },
            { toWalletType: GqlWalletType.Community },
          ],
        },
        after: endCursor,
        first: 20,
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
