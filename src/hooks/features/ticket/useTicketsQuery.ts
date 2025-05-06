'use client';

import { useQuery, DocumentNode } from '@apollo/client';
import { GetUserWalletDocument } from '@/graphql/queries/userWallet';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook for fetching tickets data from GraphQL
 * Responsible only for data fetching, not UI control or transformation
 */
export const useTicketsQuery = () => {
  const { user } = useAuth();
  
  return useQuery((GetUserWalletDocument as unknown) as DocumentNode, {
    variables: { id: user?.id ?? '' },
    skip: !user?.id,
  });
};
