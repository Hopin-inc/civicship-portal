'use client';

import { useQuery } from '@apollo/client';
import { GET_MEMBERSHIP_LIST } from '../../../graphql/queries/membership';

/**
 * Hook for fetching membership data from GraphQL
 */
export const usePlacesQuery = () => {
  return useQuery(GET_MEMBERSHIP_LIST);
};
