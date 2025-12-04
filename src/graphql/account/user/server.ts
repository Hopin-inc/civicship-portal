export const GET_CURRENT_USER_SERVER_QUERY = `
  query currentUserServer {
    currentUser {
      user {
        id
        name
        identities {
          uid
          platform
        }
        memberships {
          status
          role
          community {
            id
            name
          }
        }
      }
    }
  }
`;

export const FETCH_PROFILE_SERVER_QUERY = `
  query fetchProfileServer {
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
              instanceId
              name
              imageUrl
              createdAt
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

        nftWallet {
          id
          walletAddress
        }

        didIssuanceRequests {
          id
          status
          didValue
          requestedAt
          processedAt
          completedAt
          createdAt
          updatedAt
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

export const GET_PUBLIC_USER_SERVER_QUERY = `
  query GetPublicUser($id: ID!) {
    user(id: $id) {
      id
      name
      image
      bio
      currentPrefecture
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

      wallets {
        id
        community {
          id
        }
        currentPointView {
          currentPoint
        }
      }

      opportunitiesCreatedByMe {
        id
        title
        images
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
    }
  }
`;
