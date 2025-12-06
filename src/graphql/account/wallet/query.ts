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
          id
          type
          currentPointView {
            currentPoint
          }
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
`;

export const GET_MY_WALLET = gql`
  query GetMyWallet {
    myWallet {
      id
      type
      currentPointView {
        currentPoint
      }
      community {
        id
        name
      }
    }
  }
`;
