import { gql } from "@apollo/client";
import { PARTICIPATION_FRAGMENT } from "./fragment";

export const PARTICIPATION_BULK_CREATE = gql`
  mutation ParticipationBulkCreate($input: ParticipationBulkCreateInput!) {
    participationBulkCreate(input: $input) {
      ... on ParticipationBulkCreateSuccess {
        participations {
          ...ParticipationFields
        }
      }
    }
  }
  ${PARTICIPATION_FRAGMENT}
`;