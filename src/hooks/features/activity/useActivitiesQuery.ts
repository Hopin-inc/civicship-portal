'use client';

import { useFeaturedActivities } from "@/hooks/features/activity/useFeaturedActivities";
import { useUpcomingActivities } from "@/hooks/features/activity/useUpcomingActivities";
import { useAllActivities } from "@/hooks/features/activity/useAllActivities";
import { useInfiniteScroll } from "@/hooks/core/useInfiniteScroll";
import { GqlOpportunitiesConnection } from "@/types/graphql";
import React from "react";

export interface UseActivitiesQueryResult {
  upcomingActivities: GqlOpportunitiesConnection;
  featuredActivities: GqlOpportunitiesConnection;
  allActivities: GqlOpportunitiesConnection;
  loading: boolean;
  error: any;
  fetchMore: () => void;
  hasNextPage: boolean;
  loadMoreRef: React.RefObject<HTMLDivElement>;
}

export const useActivitiesQuery = (): UseActivitiesQueryResult => {
  const { featuredActivities, loading: loadingFeatured, error: errorFeatured } = useFeaturedActivities();
  const { upcomingActivities, loading: loadingUpcoming, error: errorUpcoming } = useUpcomingActivities();
  const {
    allActivities,
    fetchMore,
    hasNextPage,
    loading: loadingAll,
    error: errorAll
  } = useAllActivities();

  const loadMoreRef = useInfiniteScroll({
    hasMore: hasNextPage,
    isLoading: loadingAll,
    onLoadMore: fetchMore
  });

  return {
    featuredActivities,
    upcomingActivities,
    allActivities,
    fetchMore,
    hasNextPage,
    loadMoreRef,
    loading: loadingFeatured || loadingUpcoming || loadingAll,
    error: errorFeatured || errorUpcoming || errorAll,
  };
};
