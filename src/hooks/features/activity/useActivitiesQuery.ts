'use client';

import { useQuery } from '@apollo/client';
import { useMemo } from 'react';
import { GET_OPPORTUNITIES } from '@/graphql/queries/opportunities';
import { GetOpportunitiesData, OpportunityConnection } from '@/types';
import { GqlOpportunityCategory } from '@/types/graphql';

export interface UseActivitiesQueryResult {
  upcomingActivities: OpportunityConnection;
  featuredActivities: OpportunityConnection;
  allActivities: OpportunityConnection;
  loading: boolean;
  error: any;
  fetchMore: () => void;
  hasNextPage: boolean;
  endCursor: string;
}

/**
 * Hook for fetching activities data from GraphQL
 * Responsible only for data fetching, not UI control
 */
export const useActivitiesQuery = (): UseActivitiesQueryResult => {
  const queryVariables = useMemo(() => ({
    upcomingFilter: {
      category: GqlOpportunityCategory.Activity,
      publishStatus: ["PUBLIC"]
    },
    featuredFilter: {
      category: GqlOpportunityCategory.Activity,
      publishStatus: ["PUBLIC"],
      not: {
        articleIds: null
      }
    },
    allFilter: {
      category: GqlOpportunityCategory.Activity,
      publishStatus: ["PUBLIC"]
    },
    first: 20,
    cursor: null
  }), []);

  const { data, loading, error, fetchMore: apolloFetchMore } = useQuery<GetOpportunitiesData>(GET_OPPORTUNITIES, {
    variables: queryVariables,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  });

  const emptyConnection: OpportunityConnection = {
    edges: [],
    pageInfo: { hasNextPage: false, endCursor: '' },
    totalCount: 0
  };

  const upcomingActivities = data?.upcoming || emptyConnection;
  const featuredActivities = data?.featured || emptyConnection;
  const allActivities = data?.all || emptyConnection;
  const hasNextPage = data?.all.pageInfo.hasNextPage || false;
  const endCursor = data?.all.pageInfo.endCursor || '';

  const fetchMore = () => {
    apolloFetchMore({
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
    hasNextPage,
    endCursor
  };
};
