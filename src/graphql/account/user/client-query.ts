import { gql } from "@apollo/client";
import { USER_FRAGMENT, USER_PORTFOLIO_FRAGMENT } from "@/graphql/account/user/fragment";
import { WALLET_FRAGMENT } from "@/graphql/account/wallet/fragment";
import { DID_ISSUANCE_REQUEST_FRAGMENT } from "@/graphql/experience/didIssuanceRequest/fragment";
import { PLACE_FRAGMENT } from "@/graphql/location/place/fragment";

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
  ${USER_FRAGMENT}
  ${USER_PORTFOLIO_FRAGMENT}
  ${WALLET_FRAGMENT}
  ${DID_ISSUANCE_REQUEST_FRAGMENT}
  ${PLACE_FRAGMENT}
`;
