import { gql } from "@apollo/client";

export const GET_USER_FLEXIBLE = gql(`
  query GetUserFlexible(
    $id: ID!,
    $withPortfolios: Boolean! = false,
    $withWallets: Boolean! = false,
    $withOpportunities: Boolean! = false
  ) {
    user(id: $id) {
      ...UserFields
      portfolios @include(if: $withPortfolios) {
        ...UserPortfolioFields
      }
      wallets @include(if: $withWallets) {
        ...WalletFields
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
`);

export const GET_USER_WALLET = gql(`
  query GetUserWallet($id: ID!) {
    user(id: $id) {
      ...UserFields
      wallets {
        ...WalletFields
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
`);
