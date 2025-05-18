import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { useQuery } from "@apollo/client";
import { useRef } from 'react';
import { GET_OPPORTUNITY_SLOT_WITH_PARTICIPATIONS } from "../graphql/experience/opportunitySlot/query";

export interface UseSlotParticipationsResult {
  slot: any;
  participations: any[];
  loading: boolean;
  error: any;
  loadMoreRef: React.RefObject<HTMLDivElement>;
  hasMore: boolean;
  isLoadingMore: boolean;
}

export const useSlotParticipations = (slotId: string) => {
  const isLoadingMore = useRef(false);

  const {
    data,
    loading,
    error,
    fetchMore,
  } = useQuery(GET_OPPORTUNITY_SLOT_WITH_PARTICIPATIONS, {
    variables: {
      id: slotId,
      first: 10,
    },
  });

  const slot = data?.opportunitySlot || {};
  const allParticipations = slot.reservations?.flatMap((reservation: any) => reservation.participations || []) || [];
  const endCursor = slot.pageInfo?.endCursor;
  const hasNextPage = slot.pageInfo?.hasNextPage ?? false;

  const handleFetchMore = async () => {
    if (!hasNextPage || isLoadingMore.current) return;
    
    isLoadingMore.current = true;
    try {
      await fetchMore({
        variables: {
          id: slotId,
          cursor: endCursor,
          first: 10,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          isLoadingMore.current = false;
          if (!fetchMoreResult || !prev.opportunitySlot || !fetchMoreResult.opportunitySlot) {
            return prev;
          }

          const newOpportunitySlot = {
            ...prev.opportunitySlot,
            reservations: prev.opportunitySlot.reservations.map((prevReservation: any, index: number) => {
              const newReservation = fetchMoreResult.opportunitySlot.reservations[index];
              return {
                ...prevReservation,
                participations: [
                  ...prevReservation.participations,
                  ...(newReservation?.participations || []),
                ],
              };
            }),
            pageInfo: fetchMoreResult.opportunitySlot.pageInfo,
          };

          return {
            ...prev,
            opportunitySlot: newOpportunitySlot,
          };
        },
      });
    } catch (error) {
      isLoadingMore.current = false;
      console.error('Error fetching more participations:', error);
    }
  };

  const loadMoreRef = useInfiniteScroll({
    hasMore: hasNextPage,
    isLoading: loading,
    onLoadMore: handleFetchMore,
  });

  return {
    slot,
    participations: allParticipations,
    loading,
    error,
    loadMoreRef,
    hasMore: hasNextPage,
    isLoadingMore: isLoadingMore.current,
  };
};
