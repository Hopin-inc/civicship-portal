import { gql } from "@apollo/client";

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
  ) {
    user(id: $id) {
      ...UserFields
      portfolios(
        filter: $portfolioFilter
        sort: $portfolioSort
        first: $portfolioFirst
      ) @include(if: $withPortfolios) {
        ...UserPortfolioFields
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
            ...UtilityFields
          }
        }
      }
    }
  }
`;
