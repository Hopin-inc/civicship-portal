import { gql } from "@apollo/client";

export const GET_CURRENT_USER_PROFILE = gql`
  query GetCurrentUserProfile {
    currentUser {
      user {
        id
        name
        image
        bio
        currentPrefecture
        phoneNumber
        urlFacebook
        urlInstagram
        urlX

        portfolios {
          id
          title
          thumbnailUrl
          source
          category
          date
          reservationStatus
          evaluationStatus
          place {
            id
            name
          }
          participants {
            id
            image
          }
        }

        nftInstances {
          totalCount
          edges {
            node {
              id
              name
              imageUrl
            }
          }
        }

        wallets {
          id
          type
          currentPointView {
            currentPoint
          }
          community {
            id
          }
          tickets {
            id
            status
          }
        }

        opportunitiesCreatedByMe {
          id
          title
          images
          category
        }
      }
    }
  }
`;
