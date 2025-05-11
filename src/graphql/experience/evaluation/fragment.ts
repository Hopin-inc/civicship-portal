import { gql } from "@apollo/client";

export const EVALUATION_FRAGMENT = gql`
  fragment EvaluationFields on Evaluation {
    id
    comment
    credentialUrl
    status
    createdAt
    updatedAt
    issuedAt
  }
`; 