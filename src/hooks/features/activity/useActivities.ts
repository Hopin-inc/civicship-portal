'use client';

import { useActivitiesQuery } from './useActivitiesQuery';
import { useInfiniteScroll } from '@/hooks/core/useInfiniteScroll';
import React from "react";
import { GqlOpportunitiesConnection } from "@/types/graphql";

export interface UseActivitiesResult {
  upcomingActivities: GqlOpportunitiesConnection;
  featuredActivities: GqlOpportunitiesConnection;
  allActivities: GqlOpportunitiesConnection;
  loading: boolean;
  error: any;
  loadMoreRef: React.RefObject<HTMLDivElement>;
}

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
