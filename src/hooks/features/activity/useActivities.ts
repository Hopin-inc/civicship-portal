'use client';

import { useGetOpportunitiesQuery, GqlOpportunityCategory, GqlPublishStatus } from '@/types/graphql';
import React, {  useMemo, useRef } from 'react';
import { OpportunityConnection } from '@/types';

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
      publishStatus: [GqlPublishStatus.Public]
    },
    featuredFilter: {
      category: GqlOpportunityCategory.Activity,
      publishStatus: [GqlPublishStatus.Public],
      not: {
        articleIds: undefined
      }
    },
    allFilter: {
      category: GqlOpportunityCategory.Activity,
      publishStatus: [GqlPublishStatus.Public]
    },
    first: 20,
    cursor: undefined
  }), []);

  const { data, loading, error } = useGetOpportunitiesQuery({
    variables: queryVariables,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  });

  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       if (entries[0].isIntersecting && !loading && data?.all.pageInfo.hasNextPage) {
  //         fetchMore({
  //           variables: {
  //             ...queryVariables,
  //             cursor: data.all.pageInfo.endCursor,
  //           },
  //           updateQuery: (prev, { fetchMoreResult }) => {
  //             if (!fetchMoreResult) return prev;
  //             return {
  //               ...prev,
  //               all: {
  //                 ...prev.all,
  //                 edges: [...prev.all.edges, ...fetchMoreResult.all.edges],
  //                 pageInfo: fetchMoreResult.all.pageInfo,
  //               },
  //             };
  //           },
  //         });
  //       }
  //     },
  //     { threshold: 0.1 }
  //   );

  //   if (loadMoreRef.current) {
  //     observer.observe(loadMoreRef.current);
  //   }

  //   return () => observer.disconnect();
  // }, [data?.all.pageInfo, fetchMore, loading, queryVariables]);

  const emptyConnection: OpportunityConnection = {
    edges: [],
    pageInfo: { hasNextPage: false, endCursor: '' },
    totalCount: 0
  };

  const normalizeConnection = (conn: any): OpportunityConnection => {
    if (!conn) return emptyConnection;
    return {
      ...conn,
      edges: (conn.edges || []).filter((e: any) => e && e.node),
    };
  };

  return {
    upcomingActivities: normalizeConnection(data?.upcoming),
    featuredActivities: normalizeConnection(data?.featured),
    allActivities: normalizeConnection(data?.all),
    loading,
    error,
    loadMoreRef
  };
};
