import { gql } from "@apollo/client";
import { EVALUATION_FRAGMENT } from "./fragment";

export const EVALUATION_PASS = gql`
  mutation EvaluationPass($input: EvaluationCreateInput!, $permission: CheckCommunityPermissionInput!) {
    evaluationPass(input: $input, permission: $permission) {
      ... on EvaluationCreateSuccess {
        evaluation {
          ...EvaluationFields
        }
      }
    }
  }
  ${EVALUATION_FRAGMENT}
`;

export const EVALUATION_FAIL = gql`
  mutation EvaluationFail($input: EvaluationCreateInput!, $permission: CheckCommunityPermissionInput!) {
    evaluationFail(input: $input, permission: $permission) {
      ... on EvaluationCreateSuccess {
        evaluation {
          ...EvaluationFields
        }
      }
    }
  }
  ${EVALUATION_FRAGMENT}
`;
