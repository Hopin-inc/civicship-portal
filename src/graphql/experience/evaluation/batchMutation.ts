import { gql } from "@apollo/client";
import { EVALUATION_FRAGMENT } from "./fragment";

export const EVALUATION_BULK_CREATE = gql`
  mutation EvaluationBulkCreate(
    $input: EvaluationBulkCreateInput!, 
    $permission: CheckCommunityPermissionInput!
  ) {
    evaluationBulkCreate(input: $input, permission: $permission) {
      ... on EvaluationBulkCreateSuccess {
        evaluations {
          ...EvaluationFields
        }
      }
    }
  }
  ${EVALUATION_FRAGMENT}
`;
