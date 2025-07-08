import { gql } from '@apollo/client';

export const GET_VC_ISSUANCE_REQUEST_BY_EVALUATION = gql`
  query GetVcIssuanceRequestByEvaluation($evaluationId: ID!) {
    vcIssuanceRequests(filter: { evaluationId: $evaluationId }) {
      edges {
        node {
          id
          completedAt
          status
        }
      }
      totalCount
    }
  }
`;

export const GET_VC_ISSUANCE_REQUESTS_BY_USER = gql`
  query GetVcIssuanceRequestsByUser($userIds: [ID!]!) {
    vcIssuanceRequests(filter: { userIds: $userIds }) {
      edges {
        node {
          id
          status
          completedAt
          createdAt
          evaluation {
            id
            status
            participation {
              id
              opportunitySlot {
                id
              }
            }
          }
          user {
            id
          }
        }
      }
      totalCount
    }
  }
`;