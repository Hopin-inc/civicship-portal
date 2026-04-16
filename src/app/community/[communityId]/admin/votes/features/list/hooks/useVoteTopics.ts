"use client";

import { useMemo, useState } from "react";
import {
  GqlVoteTopicsConnection,
  useGetVoteTopicsQuery,
} from "@/types/graphql";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { presentVoteList } from "../presenters/presentVoteList";

interface UseVoteTopicsParams {
  communityId: string;
}

const FALLBACK_CONNECTION: GqlVoteTopicsConnection = {
  edges: [],
  nodes: [],
  pageInfo: {
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor: null,
    endCursor: null,
  },
  totalCount: 0,
};

export function useVoteTopics({ communityId }: UseVoteTopicsParams) {
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { data, loading, error, fetchMore, refetch } = useGetVoteTopicsQuery({
    variables: { communityId, first: 20 },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  const connection = data?.voteTopics ?? FALLBACK_CONNECTION;
  const endCursor = connection.pageInfo.endCursor;
  const hasNextPage = connection.pageInfo.hasNextPage ?? false;

  const handleFetchMore = async () => {
    if (!hasNextPage || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      await fetchMore({
        variables: { communityId, first: 20, cursor: endCursor },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult?.voteTopics || !prev.voteTopics) return prev;
          return {
            ...prev,
            voteTopics: {
              ...prev.voteTopics,
              edges: [
                ...new Map(
                  [
                    ...prev.voteTopics.edges,
                    ...fetchMoreResult.voteTopics.edges,
                  ].map((edge) => [edge.node?.id, edge]),
                ).values(),
              ],
              pageInfo: fetchMoreResult.voteTopics.pageInfo,
              totalCount: fetchMoreResult.voteTopics.totalCount,
            },
          };
        },
      });
    } finally {
      setIsLoadingMore(false);
    }
  };

  const loadMoreRef = useInfiniteScroll({
    hasMore: hasNextPage,
    isLoading: loading || isLoadingMore,
    onLoadMore: handleFetchMore,
  });

  const items = useMemo(
    () => (data ? presentVoteList(data.voteTopics) : []),
    [data],
  );

  return {
    items,
    loading,
    error,
    refetch,
    loadMoreRef,
    hasNextPage,
    isLoadingMore,
    totalCount: connection.totalCount,
  };
}
