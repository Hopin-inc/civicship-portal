'use client';

import { useQuery } from "@apollo/client";
import { GetUserWalletDocument } from '@/graphql/queries/userWallet';
import { DocumentNode } from 'graphql';

/**
 * Hook for fetching available tickets data from GraphQL
 * Responsible only for data fetching, not UI control or transformation
 * @param userId User ID to fetch wallet data for
 */
export const useAvailableTicketsQuery = (userId: string | undefined) => {
  return useQuery(GetUserWalletDocument as DocumentNode, {
    variables: userId ? { id: userId } : undefined,
    skip: !userId,
  });
};
