'use client';

import { useQuery } from '@apollo/client';
import { GetUserWalletDocument } from '@/types/graphql';

/**
 * Hook for fetching wallet data from GraphQL
 * @param userId User ID to fetch wallet for
 */
export const useWalletQuery = (userId: string | undefined) => {
  return useQuery(GetUserWalletDocument, {
    variables: { userId: userId ?? '' },
    skip: !userId,
    fetchPolicy: 'cache-and-network',
  });
};
