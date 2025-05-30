import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useRef } from "react";
import { useGetOpportunitySlotsQuery } from "@/types/graphql";
import { useAuth } from "@/contexts/AuthProvider";

export interface UseOpportunitySlotsResult {
  slots: any[];
  loading: boolean;
  error: any;
  loadMoreRef: React.RefObject<HTMLDivElement>;
  hasMore: boolean;
  isLoadingMore: boolean;
}

export const useOpportunitySlots = (): UseOpportunitySlotsResult => {
  const isLoadingMore = useRef(false);
  const { user } = useAuth();

  const { data, loading, error, fetchMore } = useGetOpportunitySlotsQuery({
    variables: {
      filter: {
        ownerId: user?.id,
      },
      first: 10,
    },
  });

  const opportunitySlots = data?.opportunitySlots || {
    edges: [],
    pageInfo: { hasNextPage: false, endCursor: null },
  };
  const slots = opportunitySlots.edges?.map((edge: any) => edge.node) || [];
  const endCursor = opportunitySlots.pageInfo?.endCursor;
  const hasNextPage = opportunitySlots.pageInfo?.hasNextPage ?? false;

  const handleFetchMore = async () => {
    if (!hasNextPage || isLoadingMore.current) return;

    isLoadingMore.current = true;
    try {
      await fetchMore({
        variables: {
          filter: {
            ownerId: user?.id,
          },
          cursor: endCursor,
          first: 10,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          isLoadingMore.current = false;
          if (!fetchMoreResult || !prev.opportunitySlots || !fetchMoreResult.opportunitySlots) {
            return prev;
          }

          const existingSlotIds = new Set(
            prev.opportunitySlots?.edges?.map((edge: any) => edge.node.id),
          );

          const newEdges = fetchMoreResult.opportunitySlots?.edges?.filter(
            (edge: any) => !existingSlotIds.has(edge.node.id),
          );

          const safePrevEdges = prev.opportunitySlots?.edges ?? [];
          const safeNewEdges = newEdges ?? [];

          return {
            ...prev,
            opportunitySlots: {
              ...prev.opportunitySlots,
              edges: [...safePrevEdges, ...safeNewEdges],
              pageInfo: fetchMoreResult.opportunitySlots.pageInfo,
            },
          };
        },
      });
    } catch (error) {
      isLoadingMore.current = false;
      console.error("Error fetching more slots:", error);
    }
  };

  const loadMoreRef = useInfiniteScroll({
    hasMore: hasNextPage,
    isLoading: loading,
    onLoadMore: handleFetchMore,
  });

  return {
    slots,
    loading,
    error,
    loadMoreRef,
    hasMore: hasNextPage,
    isLoadingMore: isLoadingMore.current,
  };
};
