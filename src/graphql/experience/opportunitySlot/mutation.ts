import { gql } from "@apollo/client";
import { SLOT_FRAGMENT } from "./fragment";

export const OPPORTUNITY_SLOT_SET_HOSTING_STATUS = gql`
  mutation OpportunitySlotSetHostingStatus(
    $id: ID!,
    $input: GqlOpportunitySlotSetHostingStatusInput!,
    $permission: GqlCheckOpportunityPermissionInput!
  ) {
    opportunitySlotSetHostingStatus(
      id: $id,
      input: $input,
      permission: $permission
    ) {
      ... on GqlOpportunitySlotSetHostingStatusSuccess {
        slot {
          ...OpportunitySlotFields
        }
      }
    }
  }
  ${SLOT_FRAGMENT}
`;
