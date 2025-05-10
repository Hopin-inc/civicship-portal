'use client';

import { useMemo } from 'react';
import {
  GqlGetOpportunitiesQueryVariables,
  GqlOpportunitiesConnection,
  GqlOpportunityCategory,
  GqlPublishStatus,
  useGetOpportunitiesQuery,
} from "@/types/graphql";

export interface UseActivitiesQueryResult {
  upcomingActivities: GqlOpportunitiesConnection;
  featuredActivities: GqlOpportunitiesConnection;
  allActivities: GqlOpportunitiesConnection;
  loading: boolean;
  error: any;
  fetchMore: () => void;
  startCursor: string;
  endCursor: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export const useActivitiesQuery = (): UseActivitiesQueryResult => {
  const queryVariables: GqlGetOpportunitiesQueryVariables = useMemo(() => ({
    upcomingFilter: {
      category: GqlOpportunityCategory.Activity,
      publishStatus: [GqlPublishStatus.Public]
    },
    featuredFilter: {
      category: GqlOpportunityCategory.Activity,
      publishStatus: [GqlPublishStatus.Public],
    },
    allFilter: {
      category: GqlOpportunityCategory.Activity,
      publishStatus: [GqlPublishStatus.Public],
    },
    first: 20,
    cursor: undefined
  }), []);

  const { data, loading, error, fetchMore: apolloFetchMore } = useGetOpportunitiesQuery({
    variables: queryVariables,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  });

  const emptyConnection: GqlOpportunitiesConnection = {
    edges: [],
    pageInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: "",
      endCursor: "" },
    totalCount: 0
  };

  const upcomingActivities = data?.upcoming || emptyConnection;
  const featuredActivities = data?.featured || emptyConnection;
  const allActivities = data?.all || emptyConnection;
  const startCursor = data?.all.pageInfo.startCursor || '';
  const endCursor = data?.all.pageInfo.endCursor || '';
  const hasNextPage = data?.all.pageInfo.hasNextPage || false;
  const hasPreviousPage = data?.all.pageInfo.hasPreviousPage || false;

  const fetchMore = async () => {
    await apolloFetchMore({
      variables: {
        ...queryVariables,
        cursor: endCursor,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          ...prev,
          all: {
            ...prev.all,
            edges: [...prev.all.edges, ...fetchMoreResult.all.edges],
            pageInfo: fetchMoreResult.all.pageInfo,
          },
        };
      },
    });
  };

  return {
    upcomingActivities,
    featuredActivities,
    allActivities,
    loading,
    error,
    fetchMore,
    startCursor,
    endCursor,
    hasNextPage,
    hasPreviousPage
  };
};
