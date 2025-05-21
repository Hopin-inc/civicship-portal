import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useQuery } from "@apollo/client";
import { useRef, useMemo } from 'react';
import { GET_OPPORTUNITY_SLOTS } from "@/graphql/experience/opportunitySlot/query";

export interface UseOpportunitySlotsResult {
  slots: any[];
  loading: boolean;
  error: any;
  loadMoreRef: React.RefObject<HTMLDivElement>;
  hasMore: boolean;
  isLoadingMore: boolean;
}

export const useOpportunitySlots = (): UseOpportunitySlotsResult => {
  const now = useMemo(() => new Date(), []);
  const isLoadingMore = useRef(false);

  const {
    data,
    loading,
    error,
    fetchMore,
  } = useQuery(GET_OPPORTUNITY_SLOTS, {
    variables: {
      filter: {
        dateRange: {
          lte: now.toISOString(),
        },
      },
      first: 10,
    },
  });

  const opportunitySlots = data?.opportunitySlots || { edges: [], pageInfo: { hasNextPage: false } };
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
            dateRange: {
              lte: now.toISOString(),
            },
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
            prev.opportunitySlots.edges.map((edge: any) => edge.node.id)
          );
          
          const newEdges = fetchMoreResult.opportunitySlots.edges.filter(
            (edge: any) => !existingSlotIds.has(edge.node.id)
          );

          return {
            ...prev,
            opportunitySlots: {
              ...prev.opportunitySlots,
              edges: [...prev.opportunitySlots.edges, ...newEdges],
              pageInfo: fetchMoreResult.opportunitySlots.pageInfo,
            },
          };
        },
      });
    } catch (error) {
      isLoadingMore.current = false;
      console.error('Error fetching more slots:', error);
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
