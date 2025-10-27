"use client";

import { useMemo, useCallback } from "react";
import { useQuery, gql } from "@apollo/client";
import { AppTransaction } from "@/app/wallets/features/shared/data/type";
import { presenterTransaction } from "@/app/wallets/features/shared/data/presenter";
import { GqlTransaction } from "@/types/graphql";

const GET_WALLET_TRANSACTIONS = gql`
  query GetWalletTransactions(
    $filter: TransactionFilterInput
    $sort: TransactionSortInput
    $first: Int
    $cursor: String
  ) {
    transactions(filter: $filter, sort: $sort, first: $first, cursor: $cursor) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          reason
          comment
          fromPointChange
          createdAt
          fromWallet {
            id
            type
            user {
              id
              name
              image
            }
          }
          toWallet {
            id
            type
            user {
              id
              name
              image
              didIssuanceRequests {
                status
                didValue
              }
            }
          }
        }
      }
    }
  }
`;

export interface UseWalletTransactionsResult {
  transactions: AppTransaction[];
  isLoading: boolean;
  error: Error | null;
  loadMore: () => void;
  hasNextPage: boolean;
}

export function useWalletTransactions(walletId: string): UseWalletTransactionsResult {
  const { data, loading, error, fetchMore } = useQuery(GET_WALLET_TRANSACTIONS, {
    variables: {
      filter: {
        or: [
          { fromWalletId: walletId },
          { toWalletId: walletId }
        ]
      },
      sort: { createdAt: "DESC" },
      first: 20,
    },
    fetchPolicy: "cache-and-network",
  });

  const transactions = useMemo(() => {
    const edges = data?.transactions?.edges ?? [];
    return edges
      .map((edge: { node: GqlTransaction }) => presenterTransaction(edge.node, walletId))
      .filter((tx): tx is AppTransaction => tx !== null);
  }, [data, walletId]);

  const loadMore = useCallback(() => {
    if (data?.transactions?.pageInfo?.hasNextPage) {
      fetchMore({
        variables: {
          cursor: data.transactions.pageInfo.endCursor,
        },
      });
    }
  }, [data, fetchMore]);

  return {
    transactions,
    isLoading: loading,
    error: error ? new Error(error.message) : null,
    loadMore,
    hasNextPage: data?.transactions?.pageInfo?.hasNextPage ?? false,
  };
}
