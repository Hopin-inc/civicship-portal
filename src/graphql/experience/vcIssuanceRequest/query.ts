import { gql } from '@apollo/client';

export const GET_VC_ISSUANCE_REQUEST_BY_EVALUATION = gql`
  query GetVcIssuanceRequestByEvaluation($evaluationId: ID!) {
    vcIssuanceRequests(filter: { evaluationId: $evaluationId }) {
      edges {
        node {
          id
          completedAt
        }
      }
      totalCount
    }
  }
`;