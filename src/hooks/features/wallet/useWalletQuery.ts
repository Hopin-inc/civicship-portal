'use client';

import { useQuery, gql } from '@apollo/client';

export const GET_WALLET = gql`
  query GetWallet($userId: ID!) {
    user(id: $userId) {
      id
      wallets {
        edges {
          node {
            id
            currentPointView {
              currentPoint
            }
            tickets {
              edges {
                node {
                  id
                }
              }
            }
          }
        }
      }
    }
  }
`;

export interface WalletData {
  user?: {
    id: string;
    wallets?: {
      edges: Array<{
        node: {
          id: string;
          currentPointView?: {
            currentPoint: number;
          };
          tickets?: {
            edges: Array<{
              node: {
                id: string;
              };
            }>;
          };
        };
      }>;
    };
  };
}

/**
 * Hook for fetching wallet data from GraphQL
 * @param userId User ID to fetch wallet for
 */
export const useWalletQuery = (userId: string | undefined) => {
  return useQuery<WalletData>(GET_WALLET, {
    variables: { userId: userId ?? '' },
    skip: !userId,
    fetchPolicy: 'cache-and-network',
  });
};
