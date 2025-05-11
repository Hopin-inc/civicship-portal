import { gql } from "@apollo/client";

export const GET_PARTICIPATIONS = gql`
  query GetParticipations {
    participations {
      edges {
        node {
          id
        }
      }
      totalCount
    }
  }
`;

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
              id
              startsAt
              endsAt
            }
          }
        }
      }
      source
      status
      statusHistories {
        id
        status
        reason
        createdAt
        createdByUser {
          id
          name
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
