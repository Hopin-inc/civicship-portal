import { graphql } from "@/gql";


export const GET_USER_PROFILE = graphql(`
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

export const GET_USER_WITH_DETAILS_AND_PORTFOLIOS = graphql(`
  query GetUserWithDetailsAndPortfolios(
    $id: ID!,
    $first: Int,
    $after: String,
    $filter: PortfolioFilterInput,
    $sort: PortfolioSortInput
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
      opportunitiesCreatedByMe(
        first: 5,
        filter: { slotHostingStatus: SCHEDULED }
      ) {
        edges {
          node {
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
        }
      }
      portfolios(
        first: $first,
        cursor: $after,
        filter: $filter,
        sort: $sort
      ) {
        edges {
          node {
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
          cursor
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`);

export const GET_USER_WALLET = graphql(`
  query GetUserWallet($id: ID!) {
    user(id: $id) {
      id
      wallets {
        edges {
          node {
            id
            currentPointView {
              currentPoint
              walletId
            }
            tickets(filter: { status: AVAILABLE }) {
              edges {
                node {
                  id
                  status
                  utility {
                    id
                  }
                  ticketStatusHistories {
                    edges {
                      node {
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
            }
          }
        }
      }
    }
  }
`);