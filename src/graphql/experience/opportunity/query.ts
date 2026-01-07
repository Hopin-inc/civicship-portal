import { gql } from "@apollo/client";

export const GET_ADMIN_OPPORTUNITIES = gql`
  query GetAdminOpportunities(
    $filter: OpportunityFilterInput
    $sort: OpportunitySortInput
    $first: Int
    $cursor: String
  ) {
    opportunities(filter: $filter, sort: $sort, first: $first, cursor: $cursor) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      totalCount
      edges {
        cursor
        node {
          id
          title
          description
          publishStatus
          category
          images
          requireApproval
          createdAt
          updatedAt
          createdByUser {
            id
            name
          }
        }
      }
    }
  }
`;

export const GET_OPPORTUNITIES = gql`
  query GetOpportunities(
    $filter: OpportunityFilterInput
    $sort: OpportunitySortInput
    $first: Int
    $cursor: String
    $includeSlot: Boolean! = false
    $slotFilter: OpportunitySlotFilterInput
    $slotSort: OpportunitySlotSortInput
  ) {
    opportunities(filter: $filter, sort: $sort, first: $first, cursor: $cursor) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      totalCount
      edges {
        cursor
        node {
          id
          title
          category
          images
          isReservableWithTicket
          feeRequired
          pointsToEarn
          pointsRequired
          place {
            id
            name
          }
          slots(filter: $slotFilter, sort: $slotSort) @include(if: $includeSlot) {
            id
            startsAt
            endsAt
            capacity
            remainingCapacity
            hostingStatus
          }
        }
      }
    }
  }
`;

export const GET_OPPORTUNITY = gql`
  query GetOpportunity(
    $id: ID!
    $permission: CheckCommunityPermissionInput!
    $slotFilter: OpportunitySlotFilterInput
    $slotSort: OpportunitySlotSortInput
  ) {
    opportunity(id: $id, permission: $permission) {
      id
      title
      description
      body
      images
      category
      publishStatus
      isReservableWithTicket
      requireApproval
      feeRequired
      pointsToEarn
      pointsRequired
      earliestReservableAt

      requiredUtilities {
        id
        pointsRequired
        publishStatus
      }

      community {
        id
        name
        image
      }

      place {
        id
        name
        address
        latitude
        longitude
        city {
          state {
            code
          }
        }
      }

      slots(filter: $slotFilter, sort: $slotSort) {
        id
        startsAt
        endsAt
        capacity
        remainingCapacity
        hostingStatus
      }

      articles {
        id
        category
        title
        thumbnail
        introduction
        publishedAt
      }

      createdByUser {
        id
        name
        image
        bio
        articlesAboutMe {
          id
          category
          title
          thumbnail
          introduction
          publishedAt
        }
      }
    }
  }
`;
