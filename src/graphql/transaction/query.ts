import { gql } from '@apollo/client';

export const GET_TRANSACTIONS = gql`
  query getTransactions($filter: TransactionFilterInput) {
    transactions(
      filter: $filter,
      sort: { createdAt: desc }
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
      edges {
        cursor
        node {
          ...TransactionFields
          fromWallet {
            ...WalletFields
            user {
              ...UserFields
            }
          }
          toWallet {
            ...WalletFields
            user {
              ...UserFields
            }
          }
        }
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