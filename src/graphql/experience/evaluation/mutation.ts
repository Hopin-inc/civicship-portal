import { gql } from "@apollo/client";
import { EVALUATION_FRAGMENT } from "./fragment";

export const EVALUATION_PASS = gql`
  mutation EvaluationPass($input: GqlEvaluationCreateInput!, $permission: GqlCheckCommunityPermissionInput!) {
    evaluationPass(input: $input, permission: $permission) {
      ... on GqlEvaluationCreateSuccess {
        evaluation {
          ...EvaluationFields
        }
      }
    }
  }
  ${EVALUATION_FRAGMENT}
`;

export const EVALUATION_FAIL = gql`
  mutation EvaluationFail($input: GqlEvaluationCreateInput!, $permission: GqlCheckCommunityPermissionInput!) {
    evaluationFail(input: $input, permission: $permission) {
      ... on GqlEvaluationCreateSuccess {
        evaluation {
          ...EvaluationFields
        }
      }
    }
  }
  ${EVALUATION_FRAGMENT}
`;
