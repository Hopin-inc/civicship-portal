'use client';

import { useActivitiesQuery } from './useActivitiesQuery';
import { useInfiniteScroll } from '../../../hooks/core/useInfiniteScroll';
import { OpportunityConnection } from '../../../types';

export interface UseActivitiesResult {
  upcomingActivities: OpportunityConnection;
  featuredActivities: OpportunityConnection;
  allActivities: OpportunityConnection;
  loading: boolean;
  error: any;
  loadMoreRef: React.RefObject<HTMLDivElement>;
}

/**
 * Hook for activities with infinite scroll functionality
 * This is a wrapper around useActivitiesQuery and useInfiniteScroll
 * for backward compatibility
 */
export const useActivities = (): UseActivitiesResult => {
  const {
    upcomingActivities,
    featuredActivities,
    allActivities,
    loading,
    error,
    fetchMore,
    hasNextPage
  } = useActivitiesQuery();

  const loadMoreRef = useInfiniteScroll({
    hasMore: hasNextPage,
    isLoading: loading,
    onLoadMore: fetchMore
  });

  return {
    upcomingActivities,
    featuredActivities,
    allActivities,
    loading,
    error,
    loadMoreRef
  };
};
