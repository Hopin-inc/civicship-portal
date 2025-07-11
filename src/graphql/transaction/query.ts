import { gql } from "@apollo/client";

export const GET_TRANSACTIONS = gql`
  query getTransactions(
    $filter: TransactionFilterInput
    $sort: TransactionSortInput
    $first: Int
    $cursor: String
    $withDidIssuanceRequests: Boolean = false
  ) {
    transactions(filter: $filter, sort: $sort, first: $first, cursor: $cursor) {
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
              didIssuanceRequests @include(if: $withDidIssuanceRequests) {
                ...DidIssuanceRequestFields
              }
              ...UserFields
            }
            community {
              ...CommunityFields
            }
          }
          toWallet {
            ...WalletFields
            user {
              didIssuanceRequests @include(if: $withDidIssuanceRequests) {
                ...DidIssuanceRequestFields
              }
              ...UserFields
            }
            community {
              ...CommunityFields
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
