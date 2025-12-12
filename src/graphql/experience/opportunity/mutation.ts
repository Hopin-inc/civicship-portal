import { gql } from "@apollo/client";

// =====================================
// CREATE OPPORTUNITY
// =====================================
export const CREATE_OPPORTUNITY = gql`
  mutation CreateOpportunity(
    $input: OpportunityCreateInput!
    $permission: CheckCommunityPermissionInput!
  ) {
    opportunityCreate(input: $input, permission: $permission) {
      ... on OpportunityCreateSuccess {
        opportunity {
          id
          title
          category
          description
          body
          publishStatus
          images
          requireApproval
          feeRequired
          pointsToEarn
          pointsRequired
          createdAt
          updatedAt
          createdByUser {
            id
            name
          }
          place {
            id
            name
          }
          slots {
            id
            startsAt
            endsAt
            capacity
            hostingStatus
          }
        }
      }
    }
  }
`;

// =====================================
// UPDATE OPPORTUNITY CONTENT
// =====================================
export const UPDATE_OPPORTUNITY_CONTENT = gql`
  mutation UpdateOpportunityContent(
    $id: ID!
    $input: OpportunityUpdateContentInput!
    $permission: CheckCommunityPermissionInput!
  ) {
    opportunityUpdateContent(id: $id, input: $input, permission: $permission) {
      ... on OpportunityUpdateContentSuccess {
        opportunity {
          id
          title
          category
          description
          body
          publishStatus
          images
          requireApproval
          feeRequired
          pointsToEarn
          pointsRequired
          updatedAt
          place {
            id
            name
          }
          createdByUser {
            id
            name
          }
        }
      }
    }
  }
`;

// =====================================
// UPDATE OPPORTUNITY SLOTS (BULK)
// =====================================
export const UPDATE_OPPORTUNITY_SLOTS_BULK = gql`
  mutation UpdateOpportunitySlotsBulk(
    $input: OpportunitySlotsBulkUpdateInput!
    $permission: CheckOpportunityPermissionInput!
  ) {
    opportunitySlotsBulkUpdate(input: $input, permission: $permission) {
      ... on OpportunitySlotsBulkUpdateSuccess {
        slots {
          id
          startsAt
          endsAt
          capacity
          hostingStatus
          remainingCapacity
        }
      }
    }
  }
`;

// =====================================
// SET PUBLISH STATUS
// =====================================
export const SET_PUBLISH_STATUS = gql`
  mutation SetPublishStatus(
    $id: ID!
    $input: OpportunitySetPublishStatusInput!
    $permission: CheckCommunityPermissionInput!
  ) {
    opportunitySetPublishStatus(id: $id, input: $input, permission: $permission) {
      ... on OpportunitySetPublishStatusSuccess {
        opportunity {
          id
          publishStatus
          updatedAt
        }
      }
    }
  }
`;

// =====================================
// DELETE OPPORTUNITY
// =====================================
export const DELETE_OPPORTUNITY = gql`
  mutation DeleteOpportunity(
    $id: ID!
    $permission: CheckCommunityPermissionInput!
  ) {
    opportunityDelete(id: $id, permission: $permission) {
      ... on OpportunityDeleteSuccess {
        opportunityId
      }
    }
  }
`;
