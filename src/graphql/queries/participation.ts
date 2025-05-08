import { gql } from '@apollo/client';

export const GetParticipationDocument = gql(`
  query GetParticipation($id: ID!) {
    participation(id: $id) {
      id
      images
      reason
      reservation {
        id
        opportunitySlot {
          id
          capacity
          startsAt
          endsAt
          hostingStatus
          opportunity {
            id
            title
            description
            body
            category
            capacity
            pointsToEarn
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
        participations {
          id
          user {
            id
            name
            image
          }
        }
      }
      source
      status
      statusHistories {
        edges {
          node {
            id
            status
            reason
            createdAt
            createdByUser {
              id
              name
            }
          }
        }
      }
      updatedAt
      user {
        id
        name
        image
      }
    }
  }
`);
