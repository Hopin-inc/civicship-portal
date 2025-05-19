import { gql } from "@apollo/client";
import { EVALUATION_FRAGMENT } from "./fragment";

export const BATCH_EVALUATE_PARTICIPATIONS = gql`
  mutation BatchEvaluateParticipations(
    $input: BatchEvaluationInput!, 
    $permission: CheckCommunityPermissionInput!
  ) {
    batchEvaluateParticipations(input: $input, permission: $permission) {
      ... on BatchEvaluationSuccess {
        evaluations {
          ...EvaluationFields
        }
      }
    }
  }
  ${EVALUATION_FRAGMENT}
`;
