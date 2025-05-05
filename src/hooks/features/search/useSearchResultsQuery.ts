'use client';

import { useQuery } from '@apollo/client';
import { SEARCH_OPPORTUNITIES } from '../../../graphql/queries/search';
import { GqlOpportunityFilterInput as OpportunityFilterInput } from '@/types/graphql';

/**
 * Hook for fetching search results from GraphQL
 */
export const useSearchResultsQuery = (filter: OpportunityFilterInput) => {
  return useQuery(SEARCH_OPPORTUNITIES, {
    variables: {
      filter,
      first: 20,
    },
    fetchPolicy: 'network-only',
  });
};
