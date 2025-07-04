import { gql } from '@apollo/client';

export const GET_EVALUATIONS = gql`
  query GetEvaluations ($withDidIssuanceRequests: Boolean! = false) {
    evaluations {
      edges {
        node {
          id
          status
          createdAt
          vcIssuanceRequest {
            id
            status
            requestedAt
            completedAt
            user {
              id
              name
            }
          }
          participation {
            user {
              didIssuanceRequests @include(if: $withDidIssuanceRequests) {
                ...DidIssuanceRequestFields
              }
            }
            opportunitySlot {
              id
              startsAt
              endsAt
              capacity
              opportunity {
                id
                title
                description
                community {
                  id
                }
                createdByUser {
                  id
                  name
                  didIssuanceRequests @include(if: $withDidIssuanceRequests) {
                    ...DidIssuanceRequestFields
                  }
                }
              }
            }
          }
        }
      }
      totalCount
    }
  }
`;

export const GET_EVALUATION = gql`
  query GetEvaluation($id: ID!) {
    evaluation(id: $id) {
      id
      vcIssuanceRequest {
        id
        status
        requestedAt
        completedAt
        user {
          id
          name
        }
      }
      participation {
          opportunitySlot {
            id
            startsAt
            endsAt
            capacity
            opportunity {
              id
              title
              description
              createdByUser {
                id
                name
              }
            }
          }
        }
    }
  }
`;