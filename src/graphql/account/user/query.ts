import { gql } from "@apollo/client";
import { UTILITY_WITH_OWNER_FRAGMENT } from "@/graphql/reward/utility/fragment";
import { MEMBERSHIP_FRAGMENT } from "@/graphql/account/membership/fragment";

export const GET_USER_FLEXIBLE = gql`
  query GetUserFlexible(
    $id: ID!
    $withPortfolios: Boolean! = false
    $portfolioFilter: PortfolioFilterInput
    $portfolioSort: PortfolioSortInput
    $portfolioFirst: Int
    $withWallets: Boolean! = false
    $withOpportunities: Boolean! = false
    $withDidIssuanceRequests: Boolean! = false
    $withNftInstances: Boolean! = false
  ) {
    user(id: $id) {
      ...UserFields
      portfolios(filter: $portfolioFilter, sort: $portfolioSort, first: $portfolioFirst)
        @include(if: $withPortfolios) {
        ...UserPortfolioFields
      }
      nftInstances @include(if: $withNftInstances) {
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
            instanceId
            imageUrl
            name
            createdAt
          }
        }
      }
      didIssuanceRequests @include(if: $withDidIssuanceRequests) {
        ...DidIssuanceRequestFields
      }
      wallets @include(if: $withWallets) {
        ...WalletFields
        community {
          ...CommunityFields
        }
        tickets {
          ...TicketFields
        }
      }
      opportunitiesCreatedByMe @include(if: $withOpportunities) {
        ...OpportunityFields
        community {
          ...CommunityFields
        }
        place {
          ...PlaceFields
        }
      }
    }
  }
`;

export const GET_USER_WALLET = gql`
  query GetUserWallet($id: ID!) {
    user(id: $id) {
      ...UserFields
      wallets {
        ...WalletFields
        community {
          ...CommunityFields
        }
        transactions {
          ...TransactionFields
          fromWallet {
            ...WalletFields
            user {
              ...UserFields
            }
            community {
              ...CommunityFields
            }
          }
          toWallet {
            ...WalletFields
            user {
              ...UserFields
            }
            community {
              ...CommunityFields
            }
          }
        }
        tickets {
          ...TicketFields
          utility {
            ...UtilityWithOwnerFields
          }
        }
      }
    }
  }
  ${UTILITY_WITH_OWNER_FRAGMENT}
`;

export const GET_CURRENT_USER_SERVER = gql`
  query currentUserServer($id: ID!) {
    user(id: $id) {
      id
      name
      memberships {
        ...MembershipFields
        user {
          id
          name
        }
        community {
          id
          name
        }
        role
        status
      }
    }
  }
  ${MEMBERSHIP_FRAGMENT}
`;
