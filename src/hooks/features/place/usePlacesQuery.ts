'use client';

import { useQuery } from '@apollo/client';
import { GET_MEMBERSHIP_LIST } from '@/graphql/queries/membership';

/**
 * Hook for fetching membership data from GraphQL
 * Responsible only for data fetching, not UI control
 */
export const usePlacesQuery = () => {
  return useQuery(GET_MEMBERSHIP_LIST);
};
