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
      opportunitiesCreatedByMe{
        id
        title
        description
        images
        community {
          id
          name
          image
        }
        place {
          id
          name
        }
        feeRequired
        isReservableWithTicket
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
          id
          name
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
        currentPointView {
          currentPoint
          walletId
        }
        tickets {
          id
          status
          utility {
            id
          }
          ticketStatusHistories {
            id
            status
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