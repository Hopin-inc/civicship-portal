import { gql } from '@apollo/client';

export const GET_EVALUATIONS = gql`
  query GetEvaluations {
    evaluations {
      edges {
        node {
          id
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
    }
  }
`;