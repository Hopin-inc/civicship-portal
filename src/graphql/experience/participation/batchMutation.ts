import { gql } from "@apollo/client";
import { PARTICIPATION_FRAGMENT } from "./fragment";

export const PARTICIPATION_BULK_CREATE = gql`
  mutation ParticipationBulkCreate(
    $input: ParticipationBulkCreateInput!, 
    $permission: CheckCommunityPermissionInput!
  ) {
    participationBulkCreate(input: $input, permission: $permission) {
      ... on ParticipationBulkCreateSuccess {
        participations {
          ...ParticipationFields
        }
      }
    }
  }
  ${PARTICIPATION_FRAGMENT}
`;