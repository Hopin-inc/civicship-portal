"use client";

import {
  useGetAdminOpportunitiesQuery,
  GqlPublishStatus,
  GqlOpportunitiesConnection,
  GqlOpportunityFilterInput,
} from "@/types/graphql";
import { presentOpportunityList } from "../../presenters/presentOpportunityList";
import { useMemo, useState } from "react";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { COMMUNITY_ID } from "@/lib/communities/metadata";

const fallbackConnection: GqlOpportunitiesConnection = {
  edges: [],
  pageInfo: {
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor: null,
    endCursor: null,
  },
  totalCount: 0,
};

interface UseOpportunitiesOptions {
  /**
   * フィルタする公開ステータス
   * "all" を指定すると全てのステータスを取得
   */
  publishStatus?: GqlPublishStatus | "all";
}

interface UseOpportunitiesReturn {
  data: ReturnType<typeof presentOpportunityList> | null;
  loading: boolean;
  error: any;
  loadMoreRef: (node: HTMLDivElement | null) => void;
  hasNextPage: boolean;
  isLoadingMore: boolean;
  refetch: () => void;
}

export function useOpportunities(options?: UseOpportunitiesOptions): UseOpportunitiesReturn {
  const { publishStatus = "all" } = options || {};
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // GraphQLフィルタの構築
  const filter = useMemo((): GqlOpportunityFilterInput => {
    if (publishStatus === "all")
      return {
        communityIds: [COMMUNITY_ID],
      };

    return { publishStatus: [publishStatus], communityIds: [COMMUNITY_ID] };
  }, [publishStatus]);

  // useQueryを直接使用
  const { data, loading, error, fetchMore, refetch } = useGetAdminOpportunitiesQuery({
    variables: {
      filter,
      first: 20,
    },
    fetchPolicy: "cache-first",
  });

  const opportunities = data?.opportunities ?? fallbackConnection;
  const endCursor = opportunities.pageInfo?.endCursor;
  const hasNextPage = opportunities.pageInfo?.hasNextPage ?? false;

  const handleFetchMore = async () => {
    if (!hasNextPage || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      await fetchMore({
        variables: {
          filter,
          cursor: endCursor,
          first: 20,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult || !prev.opportunities || !fetchMoreResult.opportunities) {
            return prev;
          }

          return {
            ...prev,
            opportunities: {
              ...prev.opportunities,
              edges: [
                ...new Map(
                  [...prev.opportunities.edges, ...fetchMoreResult.opportunities.edges].map(
                    (edge) => [edge?.node?.id, edge],
                  ),
                ).values(),
              ],
              pageInfo: fetchMoreResult.opportunities.pageInfo,
            },
          };
        },
      });
    } catch (err) {
      console.error("Failed to fetch more opportunities:", err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const loadMoreRef = useInfiniteScroll({
    hasMore: hasNextPage,
    isLoading: loading || isLoadingMore,
    onLoadMore: handleFetchMore,
  });

  // プレゼンテーション層への変換
  const formatted = useMemo(() => {
    return data ? presentOpportunityList(data.opportunities) : null;
  }, [data]);

  return {
    data: formatted,
    loading,
    error,
    loadMoreRef,
    hasNextPage,
    isLoadingMore,
    refetch,
  };
}
