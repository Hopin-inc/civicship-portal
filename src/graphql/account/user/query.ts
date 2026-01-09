import { gql } from "@apollo/client";
import { UTILITY_WITH_OWNER_FRAGMENT } from "@/graphql/reward/utility/fragment";
import { USER_FRAGMENT, USER_PORTFOLIO_FRAGMENT } from "@/graphql/account/user/fragment";
import { OPPORTUNITY_FRAGMENT } from "@/graphql/experience/opportunity/fragment";
import { WALLET_FRAGMENT } from "@/graphql/account/wallet/fragment";
import { COMMUNITY_FRAGMENT } from "@/graphql/account/community/fragment";
import { PLACE_FRAGMENT } from "@/graphql/location/place/fragment";
import { DID_ISSUANCE_REQUEST_FRAGMENT } from "@/graphql/experience/didIssuanceRequest/fragment";
import { TICKET_FRAGMENT } from "@/graphql/reward/ticket/fragment";

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
            community {
              id
            }
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
  ${USER_FRAGMENT}
  ${USER_PORTFOLIO_FRAGMENT}
  ${OPPORTUNITY_FRAGMENT}
  ${WALLET_FRAGMENT}
  ${COMMUNITY_FRAGMENT}
  ${PLACE_FRAGMENT}
  ${DID_ISSUANCE_REQUEST_FRAGMENT}
  ${TICKET_FRAGMENT}
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
              id
              name
              image
            }
            community {
              ...CommunityFields
            }
          }
          toWallet {
            ...WalletFields
            user {
              id
              name
              image
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
