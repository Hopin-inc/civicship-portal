"use client";

import { useFeaturedActivities } from "@/app/activities/hooks/useFeaturedActivities";
import { useUpcomingActivities } from "@/app/activities/hooks/useUpcomingActivities";
import { useAllActivities } from "@/app/activities/hooks/useAllActivities";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
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
  const {
    featuredActivities,
    loading: loadingFeatured,
    error: errorFeatured,
  } = useFeaturedActivities();
  const {
    upcomingActivities,
    loading: loadingUpcoming,
    error: errorUpcoming,
  } = useUpcomingActivities();
  const {
    allActivities,
    fetchMore,
    hasNextPage,
    loading: loadingAll,
    error: errorAll,
  } = useAllActivities();

  const loadMoreRef = useInfiniteScroll({
    hasMore: hasNextPage,
    isLoading: loadingAll,
    onLoadMore: fetchMore,
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
