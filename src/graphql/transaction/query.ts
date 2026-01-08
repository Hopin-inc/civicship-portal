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
            id
            type
            user {
              id
              name
              image
              didIssuanceRequests @include(if: $withDidIssuanceRequests) {
                status
                didValue
              }
            }
            community {
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
              didIssuanceRequests @include(if: $withDidIssuanceRequests) {
                status
                didValue
              }
            }
            community {
              id
              name
              image
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

export const GET_TRANSACTION_DETAIL = gql`
  query GetTransactionDetail($id: ID!) {
    transaction(id: $id) {
      ...TransactionFields
      fromWallet {
        id
        type
        user {
          id
          name
          image
        }
        community {
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
        }
        community {
          id
          name
          image
        }
      }
    }
  }
`;

export const VERIFY_TRANSACTIONS = gql`
  query VerifyTransactions($txIds: [ID!]!) {
    verifyTransactions(txIds: $txIds) {
      txId
      status
      transactionHash
      rootHash
      label
    }
  }
`;
