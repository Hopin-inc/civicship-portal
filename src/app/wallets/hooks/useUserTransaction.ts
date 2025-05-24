import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { GqlTransactionsConnection, useGetTransactionsQuery } from "@/types/graphql";

export interface UseMyTransactionsResult {
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

const useUserTransactions = (userId: string): UseMyTransactionsResult => {
  const { data, loading, error, fetchMore, refetch } = useGetTransactionsQuery({
    variables: {
      filter: {
        or: [{ fromUserId: userId }, { toUserId: userId }],
      },
      first: 20,
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "network-only",
  });

  const connection = data?.transactions ?? fallbackConnection;
  const endCursor = connection.pageInfo?.endCursor;
  const hasNextPage = connection.pageInfo?.hasNextPage ?? false;

  const handleFetchMore = async () => {
    if (!hasNextPage) return;

    await fetchMore({
      variables: {
        filter: {
          or: [{ fromUserId: userId }, { toUserId: userId }],
        },
        after: endCursor,
        first: 10,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult || !prev.transactions) return prev;

        const prevEdges = prev.transactions.edges ?? [];
        const newEdges = fetchMoreResult.transactions?.edges ?? [];

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

export default useUserTransactions;
