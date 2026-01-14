"use client";

import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import React from "react";
import {
  GqlReservationFilterInput,
  GqlReservationsConnection,
  GqlRole,
  GqlSortDirection,
  useGetReservationsQuery,
} from "@/types/graphql";
import { useAuth } from "@/contexts/AuthProvider";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";
import { useAdminRole } from "@/app/[communityId]/admin/context/AdminRoleContext";

export interface UseReservationsResult {
  reservations: GqlReservationsConnection;
  loading: boolean;
  error: any;
  loadMoreRef: React.RefObject<HTMLDivElement>;
  refetch: () => void;
}

const fallbackConnection: GqlReservationsConnection = {
  edges: [],
  pageInfo: {
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor: null,
    endCursor: null,
  },
  totalCount: 0,
};

const useReservations = (filter: GqlReservationFilterInput): UseReservationsResult => {
  const { user } = useAuth();
  const { communityId } = useCommunityConfig();
  const role = useAdminRole();

  const mergedFilter = React.useMemo(
    () => ({
      ...filter,
      communityId,
      // ownerの場合は全ての予約を表示、それ以外は自分が主催する予約のみ
      ...(role !== GqlRole.Owner && { opportunityOwnerId: user?.id ?? undefined }),
    }),
    [filter, communityId, user?.id, role],
  );

  const { data, loading, error, fetchMore, refetch } = useGetReservationsQuery({
    variables: {
      filter: mergedFilter,
      first: 20,
      sort: { createdAt: GqlSortDirection.Desc },
    },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  const reservations = data?.reservations ?? fallbackConnection;
  const endCursor = reservations.pageInfo?.endCursor;
  const hasNextPage = reservations.pageInfo?.hasNextPage ?? false;

  const handleFetchMore = async () => {
    if (!hasNextPage) return;

    await fetchMore({
      variables: {
        filter: mergedFilter,
        cursor: endCursor,
        sort: { createdAt: GqlSortDirection.Desc },
        first: 10,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult || !prev.reservations || !fetchMoreResult.reservations) {
          return prev;
        }

        const prevEdges = prev.reservations.edges ?? [];
        const newEdges = fetchMoreResult.reservations.edges;

        // 既存の ID をセットに
        const existingIds = new Set(prevEdges.map((edge) => edge.node?.id));

        // 重複していない新しいエッジだけを残す
        const filteredNewEdges = newEdges.filter(
          (edge) => edge.node && !existingIds.has(edge.node.id),
        );

        return {
          ...prev,
          reservations: {
            ...prev.reservations,
            edges: [...prevEdges, ...filteredNewEdges],
            pageInfo: fetchMoreResult.reservations.pageInfo,
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
    reservations,
    loading,
    error,
    loadMoreRef,
    refetch,
  };
};

export default useReservations;
