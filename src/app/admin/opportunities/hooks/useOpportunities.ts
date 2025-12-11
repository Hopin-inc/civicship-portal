"use client";

import { presentOpportunityList } from "../presenters/presentOpportunityList";
import { useGetAdminOpportunitiesQuery } from "@/types/graphql";

export function useOpportunities() {
  const { data, loading, error, fetchMore } = useGetAdminOpportunitiesQuery({
    variables: {
      first: 20,
    },
  });

  const formatted = data ? presentOpportunityList(data.opportunities) : null;

  return {
    loading,
    error,
    data: formatted,
    fetchMore: () => {
      if (!formatted?.pageInfo.hasNextPage) return;

      return fetchMore({
        variables: {
          cursor: formatted.pageInfo.endCursor,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;

          return {
            opportunities: {
              ...fetchMoreResult.opportunities,
              edges: [...prev.opportunities.edges, ...fetchMoreResult.opportunities.edges],
            },
          };
        },
      });
    },
  };
}
