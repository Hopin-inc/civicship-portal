'use client';

import { useQuery } from '@apollo/client';
import React, { useEffect, useMemo, useRef } from 'react';
import { GET_OPPORTUNITIES } from '@/graphql/queries/opportunities';
import { GetOpportunitiesData, OpportunityConnection } from '@/types';
import { GqlOpportunityCategory } from '@/types/graphql';

export interface UseActivitiesResult {
  upcomingActivities: OpportunityConnection;
  featuredActivities: OpportunityConnection;
  allActivities: OpportunityConnection;
  loading: boolean;
  error: any;
  loadMoreRef: React.RefObject<HTMLDivElement>;
}

export const useActivities = (): UseActivitiesResult => {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
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

  const { data, loading, error, fetchMore } = useQuery<GetOpportunitiesData>(GET_OPPORTUNITIES, {
    variables: queryVariables,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && data?.all.pageInfo.hasNextPage) {
          fetchMore({
            variables: {
              ...queryVariables,
              cursor: data.all.pageInfo.endCursor,
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
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [data?.all.pageInfo, fetchMore, loading, queryVariables]);

  const emptyConnection: OpportunityConnection = {
    edges: [],
    pageInfo: { hasNextPage: false, endCursor: '' },
    totalCount: 0
  };

  return {
    upcomingActivities: data?.upcoming || emptyConnection,
    featuredActivities: data?.featured || emptyConnection,
    allActivities: data?.all || emptyConnection,
    loading,
    error,
    loadMoreRef
  };
};
