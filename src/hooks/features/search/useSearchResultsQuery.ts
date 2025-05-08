'use client';

import { useQuery } from '@apollo/client';
import { SEARCH_OPPORTUNITIES } from '@/graphql/queries/search';
import { GqlOpportunityFilterInput as OpportunityFilterInput } from '@/types/graphql';

/**
 * Hook for fetching search results from GraphQL
 * Accepts either a filter object or a function that returns a filter object
 */
export const useSearchResultsQuery = (
  filter: OpportunityFilterInput | (() => OpportunityFilterInput)
) => {
  const filterValue = typeof filter === 'function' ? filter() : filter;
  
  return useQuery(SEARCH_OPPORTUNITIES, {
    variables: {
      filter: filterValue,
      first: 20,
    },
    fetchPolicy: 'network-only',
  });
};
