'use client';

import { useQuery, gql, QueryResult } from '@apollo/client';
import { TransactionReason } from "@/gql/graphql";
import { WalletTransactionsDocument } from '@/graphql/queries/wallet';

export interface TransactionNode {
  id: string;
  amount: number;
  reason: TransactionReason;
  createdAt: string;
  fromUser?: {
    id: string;
    name: string;
  } | null;
  toUser?: {
    id: string;
    name: string;
  } | null;
}

export interface TransactionHistoryData {
  user?: {
    id: string;
    wallets?: {
      edges: Array<{
        node: {
          id: string;
          transactions?: {
            edges: Array<{
              node: TransactionNode;
              cursor: string;
            }>;
            pageInfo: {
              hasNextPage: boolean;
              endCursor: string;
            };
          };
        };
      }>;
    };
  };
}

/**
 * Hook for fetching transaction history data from GraphQL
 * @param userId User ID to fetch transactions for
 * @param first Number of transactions to fetch
 */
export const useTransactionHistoryQuery = (userId: string | undefined, first: number = 10): QueryResult<TransactionHistoryData> => {
  return useQuery<TransactionHistoryData>(WalletTransactionsDocument, {
    variables: { 
      userId: userId ?? '',
      first,
      after: null
    },
    skip: !userId,
    fetchPolicy: 'cache-and-network',
  });
};
