import { gql } from '@apollo/client';

export const GET_WALLETS_WITH_TRANSACTION = gql`
  query GetWalletsWithTransaction($filter: WalletFilterInput, $first: Int, $cursor: String) {
    wallets(filter: $filter, first: $first, cursor: $cursor) {
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
          ...WalletFields
          transactions {
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
  }
`;

export const GET_WALLETS_WITH_TICKET = gql`
  query GetWalletsWithTicket($filter: WalletFilterInput, $first: Int, $cursor: String) {
    wallets(filter: $filter, first: $first, cursor: $cursor) {
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
          ...WalletFields
          tickets {
            ...TicketFields
            utility {
              ...UtilityFields
            }
          }
        }
      }
    }
  }
`;