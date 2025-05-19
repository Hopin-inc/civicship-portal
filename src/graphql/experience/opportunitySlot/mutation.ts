import { gql } from "@apollo/client";
import { SLOT_FRAGMENT } from "./fragment";

export const OPPORTUNITY_SLOT_SET_HOSTING_STATUS = gql`
  mutation OpportunitySlotSetHostingStatus(
    $id: ID!,
    $input: OpportunitySlotSetHostingStatusInput!,
    $permission: CheckOpportunityPermissionInput!
  ) {
    opportunitySlotSetHostingStatus(
      id: $id,
      input: $input,
      permission: $permission
    ) {
      ... on OpportunitySlotSetHostingStatusSuccess {
        slot {
          ...OpportunitySlotFields
        }
      }
    }
  }
  ${SLOT_FRAGMENT}
`;
