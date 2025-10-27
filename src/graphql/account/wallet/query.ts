import { gql } from "@apollo/client";

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

export const GET_COMMUNITY_WALLET = gql`
  query GetCommunityWallet($communityId: ID!) {
    wallets(filter: { type: COMMUNITY, communityId: $communityId }) {
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
          community {
            ...CommunityFields
          }
        }
      }
    }
  }
`;

export const GET_MEMBER_WALLETS = gql`
  query GetMemberWallets(
    $filter: WalletFilterInput
    $first: Int
    $cursor: String
    $withDidIssuanceRequests: Boolean! = false
  ) {
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
          user {
            ...UserFields
            didIssuanceRequests @include(if: $withDidIssuanceRequests) {
              ...DidIssuanceRequestFields
            }
          }
          community {
            ...CommunityFields
          }
        }
      }
    }
  }
`;

export const GET_WALLET_BY_ID = gql`
  query GetWalletById($id: ID!) {
    wallet(id: $id) {
      id
      type
      currentPointView {
        currentPoint
      }
      user {
        id
        name
        image
      }
      community {
        id
        name
      }
    }
  }
`;

export const GET_WALLET_TRANSACTIONS_QUERY = gql`
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
            }
          }
        }
      }
    }
  }
`;

export const GET_MY_WALLET = gql`
  query GetMyWallet {
    myWallet {
      id
      type
      currentPointView {
        currentPoint
      }
      accumulatedPointView {
        accumulatedPoint
      }
      user {
        id
        name
        image
      }
      community {
        id
        name
      }
    }
  }
`;

export const GET_WALLET_WITH_TRANSACTIONS_CONNECTION = gql`
  query GetWalletWithTransactionsConnection(
    $id: ID!
    $first: Int
    $cursor: String
    $sort: TransactionSortInput
  ) {
    wallet(id: $id) {
      id
      type
      currentPointView {
        currentPoint
      }
      accumulatedPointView {
        accumulatedPoint
      }
      user {
        id
        name
        image
      }
      community {
        id
        name
      }
      transactionsConnection(first: $first, cursor: $cursor, sort: $sort) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        edges {
          cursor
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
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_MY_WALLET_WITH_TRANSACTIONS_CONNECTION = gql`
  query GetMyWalletWithTransactionsConnection(
    $first: Int
    $cursor: String
    $sort: TransactionSortInput
  ) {
    myWallet {
      id
      type
      currentPointView {
        currentPoint
      }
      accumulatedPointView {
        accumulatedPoint
      }
      user {
        id
        name
        image
      }
      community {
        id
        name
      }
      transactionsConnection(first: $first, cursor: $cursor, sort: $sort) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        edges {
          cursor
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
              }
            }
          }
        }
      }
    }
  }
`;
