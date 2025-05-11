'use client';

import { useQuery } from "@apollo/client";
import { GET_USER_WALLET } from '@/graphql/account/user/query';
import { DocumentNode } from 'graphql';

/**
 * Hook for fetching available tickets data from GraphQL
 * Responsible only for data fetching, not UI control or transformation
 * @param userId User ID to fetch wallet data for
 */
export const useAvailableTicketsQuery = (userId: string | undefined) => {
  return useQuery(GET_USER_WALLET as DocumentNode, {
    variables: userId ? { id: userId } : undefined,
    skip: !userId,
  });
};
