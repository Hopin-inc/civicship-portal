import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query GetUsers {
    users {
      edges {
        node {
          id
          name
        }
      }
      totalCount
    }
  }
`;

export const GET_USER_PROFILE = gql(`
  query GetUserProfile(
    $id: ID!
  ) {
    user(id: $id) {
      id
      name
      image
      bio
      sysRole
      currentPrefecture
      urlFacebook
      urlInstagram
      urlWebsite
      urlX
      urlYoutube
    }
  }
`);

export const GET_USER_WITH_DETAILS_AND_PORTFOLIOS = gql(`
  query GetUserWithDetailsAndPortfolios(
    $id: ID!,
  ) {
    user(id: $id) {
      ...UserFields
      opportunitiesCreatedByMe{
        ...OpportunityFields
        community {
          id
          name
          image
        }
        place {
          ...PlaceFields
        }
      }
      portfolios {
        id
        title
        category
        date
        thumbnailUrl
        source
        reservationStatus
        place {
          ...PlaceFields
        }
        participants {
          id
          name
          image
        }
      }
    }
  }
`);

export const GET_USER_WALLET = gql(`
  query GetUserWallet($id: ID!) {
    user(id: $id) {
      id
      wallets {
        id
        type
        currentPointView {
          currentPoint
          walletId
        }
        tickets {
          id
          status
          reason
          utility {
            id
            publishStatus
            pointsRequired
          }
          ticketStatusHistories {
            id
            status
            reason
            createdByUser {
              id
              name
              image
            }
          }
        }
      }
    }
  }
`);