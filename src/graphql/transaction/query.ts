import { gql } from '@apollo/client';

export const WALLET_TRANSACTIONS = gql`
  query WalletTransactions($filter: TransactionFilterInput) {
    transactions(
      filter: $filter,
      sort: { createdAt: desc }
    ) {
      edges {
        node {
          id
          createdAt
          fromPointChange
          toPointChange
          reason
          fromWallet {
            id
            user {
              id
              name
            }
          }
          toWallet {
            id
            user {
              id
              name
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_TRANSACTION = gql`
  query GetTransaction($id: ID!) {
    transaction(id: $id) {
      id
    }
  }
`;