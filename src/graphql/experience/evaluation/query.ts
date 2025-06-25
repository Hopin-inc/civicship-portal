import { gql } from '@apollo/client';

export const GET_EVALUATIONS = gql`
  query GetEvaluations {
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
      }
    }
  }
`;