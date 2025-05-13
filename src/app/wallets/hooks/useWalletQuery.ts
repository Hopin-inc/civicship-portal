'use client';

import { useQuery } from '@apollo/client';
import { GET_USER_WALLET } from '@/graphql/account/user/query';

/**
 * Hook for fetching wallet data from GraphQL
 * @param userId User ID to fetch wallet for
 */
export const useWalletQuery = (userId: string | undefined) => {
  return useQuery(GET_USER_WALLET, {
    variables: userId ? { id: userId } : undefined,
    skip: !userId,
    fetchPolicy: 'cache-and-network',
  });
};
