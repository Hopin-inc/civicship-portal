import { gql } from "@apollo/client";

export const GET_OPPORTUNITY = gql`
  query GetOpportunity($id: ID!, $permission: CheckCommunityPermissionInput!) {
    opportunity(id: $id, permission: $permission) {
      id
      title
      description
      body
      category
      capacity
      pointsToEarn
      isReservableWithTicket
      feeRequired
      requireApproval
      publishStatus
      images
      createdAt
      updatedAt
      community {
        id
        name
        image
      }
      createdByUser {
        id
        name
        image
        articlesAboutMe(
          first: 1,
          filter: { publishStatus: [PUBLIC], categories: ["INTERVIEW"] },
          sort: { publishedAt: desc }
        ) {
          edges {
            node {
              id
              title
              introduction
              thumbnail
              createdAt
            }
          }
        }
        opportunitiesCreatedByMe(first: 5) {
          edges {
            node {
              id
              title
              description
              category
              capacity
              community {
                id
                name
                image
              }
              pointsToEarn
              feeRequired
              requireApproval
              publishStatus
              images
              createdAt
              updatedAt
              slots {
                edges {
                  node {
                    id
                    startsAt
                    endsAt
                    participations {
                      edges {
                        node {
                          id
                          status
                          user {
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
      place {
        id
        name
        address
        latitude
        longitude
        city {
          name
          state {
            name
          }
        }
      }
      requiredUtilities {
        id
      }
      slots {
        edges {
          node {
            id
            startsAt
            endsAt
            participations {
              edges {
                node {
                  id
                  status
                  images
                  user {
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
`; 