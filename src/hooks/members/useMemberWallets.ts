"use client";

import { useCallback, useState } from "react";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";
import { useGetMemberWalletsQuery, GqlGetMemberWalletsQuery } from "@/types/graphql";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { toast } from "react-toastify";
import { useAuthStore } from "@/lib/auth/core/auth-store";

export interface UseMemberWalletsResult {
  data: GqlGetMemberWalletsQuery | undefined;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
  loadMoreRef: React.RefObject<HTMLDivElement>;
  hasNextPage: boolean;
  isLoadingMore: boolean;
}

/**
 * Hook to fetch member wallets for the current community
 * @param communityIdOverride - Optional override for communityId (uses CommunityConfigContext if not provided)
 */
export const useMemberWallets = (communityIdOverride?: string): UseMemberWalletsResult => {
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { state } = useAuthStore();
  const hasFirebaseUser = !!state.firebaseUser;
  
  // Use runtime communityId from context, with optional override
  const communityConfig = useCommunityConfig();
  const communityId = communityIdOverride || communityConfig?.communityId || "";

  const { data, loading, error, refetch, fetchMore } = useGetMemberWalletsQuery({
    variables: {
      filter: {
        communityId: communityId,
      },
      first: 20,
      withDidIssuanceRequests: true,
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
    skip: !hasFirebaseUser || !communityId, // Wait for Firebase auth and communityId before querying
  });

  const wallets = data?.wallets || {
    edges: [],
    pageInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: null,
      endCursor: null,
    },
    totalCount: 0,
  };

  const endCursor = wallets.pageInfo?.endCursor;
  const hasNextPage = wallets.pageInfo?.hasNextPage ?? false;

  const handleFetchMore = useCallback(async () => {
    if (!hasNextPage || isLoadingMore || !communityId) return;
    setIsLoadingMore(true);
    try {
      await fetchMore({
        variables: {
          filter: {
            communityId: communityId,
          },
          first: 20,
          cursor: endCursor,
          withDidIssuanceRequests: true,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult || !prev.wallets || !fetchMoreResult.wallets) {
            return prev;
          }

          return {
            ...prev,
            wallets: {
              ...prev.wallets,
              edges: [
                ...new Map(
                  [...(prev.wallets.edges || []), ...(fetchMoreResult.wallets.edges || [])].map(
                    (edge) => [edge?.node?.id, edge],
                  ),
                ).values(),
              ],
              pageInfo: fetchMoreResult.wallets.pageInfo,
            },
          };
        },
      });
    } catch (error) {
      console.error(error);
      toast.error("データの取得に失敗しました");
    } finally {
      setIsLoadingMore(false);
    }
  }, [hasNextPage, isLoadingMore, endCursor, fetchMore, communityId]);

  const loadMoreRef = useInfiniteScroll({
    hasMore: hasNextPage && !isLoadingMore,
    isLoading: isLoadingMore,
    onLoadMore: () => {
      handleFetchMore();
    },
  });

  return {
    data,
    loading,
    error: error ?? null,
    refetch,
    loadMoreRef,
    hasNextPage,
    isLoadingMore,
  };
};            