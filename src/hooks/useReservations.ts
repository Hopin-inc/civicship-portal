import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { useQuery } from "@apollo/client";
import { useRef, useMemo } from 'react';
import { GET_RESERVATIONS } from "../graphql/experience/reservation/query";
import { useAuth } from '@/contexts/AuthContext';

export interface UseReservationsResult {
  reservations: any[];
  loading: boolean;
  error: any;
  loadMoreRef: React.RefObject<HTMLDivElement>;
  hasMore: boolean;
  isLoadingMore: boolean;
}

export const useReservations = (statusFilter?: string | null) => {
  const isLoadingMore = useRef(false);
  const { user } = useAuth();

  const filterVariables = useMemo(() => {
    const filter: any = {
      createdByUserId: user?.id
    };

    if (!statusFilter) return filter;

    if (statusFilter === 'APPLIED') {
      filter.status = 'APPLIED';
    } else if (statusFilter === 'NOT_APPLIED') {
      filter.status_not = 'APPLIED';
    }
    
    return filter;
  }, [statusFilter, user?.id]);

  const {
    data,
    loading,
    error,
    fetchMore,
  } = useQuery(GET_RESERVATIONS, {
    variables: {
      filter: filterVariables,
      first: 10,
    },
  });

  const reservationsData = data?.reservations || { edges: [], pageInfo: { hasNextPage: false } };
  const reservations = reservationsData.edges?.map((edge: any) => edge.node) || [];
  const endCursor = reservationsData.pageInfo?.endCursor;
  const hasNextPage = reservationsData.pageInfo?.hasNextPage ?? false;

  const handleFetchMore = async () => {
    if (!hasNextPage || isLoadingMore.current) return;
    
    isLoadingMore.current = true;
    try {
      await fetchMore({
        variables: {
          filter: filterVariables,
          cursor: endCursor,
          first: 10,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          isLoadingMore.current = false;
          if (!fetchMoreResult || !prev.reservations || !fetchMoreResult.reservations) {
            return prev;
          }

          return {
            ...prev,
            reservations: {
              ...prev.reservations,
              edges: [
                ...prev.reservations.edges,
                ...fetchMoreResult.reservations.edges,
              ],
              pageInfo: fetchMoreResult.reservations.pageInfo,
            },
          };
        },
      });
    } catch (error) {
      isLoadingMore.current = false;
      console.error('Error fetching more reservations:', error);
    }
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
    hasMore: hasNextPage,
    isLoadingMore: isLoadingMore.current,
  };
};
