import { gql } from "@apollo/client";

export const GET_CURRENT_USER_PROFILE = gql`
  query GetCurrentUserProfile {
    currentUser {
      user {
        ...UserFields
        portfolios {
          ...UserPortfolioFields
        }
        nftInstances {
          totalCount
          edges {
            node {
              id
              instanceId
              name
              imageUrl
              createdAt
            }
          }
        }

        wallets {
          ...WalletFields
          community {
            id
          }
          tickets {
            id
            status
          }
        }

        nftWallet {
          id
          walletAddress
        }

        didIssuanceRequests {
          ...DidIssuanceRequestFields
        }

        opportunitiesCreatedByMe {
          id
          title
          images
        }
      }
    }
  }
`;
