import { gql } from "@apollo/client";
import { OPPORTUNITY_FRAGMENT } from "@/graphql/experience/opportunity/fragment";
import { COMMUNITY_FRAGMENT } from "@/graphql/account/community/fragment";
import { PLACE_FRAGMENT } from "@/graphql/location/place/fragment";
import { SLOT_FRAGMENT } from "@/graphql/experience/opportunitySlot/fragment";

export const GET_OPPORTUNITIES = gql`
  query GetOpportunities(
    $upcomingFilter: OpportunityFilterInput
    $featuredFilter: OpportunityFilterInput
    $allFilter: OpportunityFilterInput
    $similarFilter: OpportunityFilterInput
    $first: Int
    $cursor: String
  ) {
    upcoming: opportunities(
      filter: $upcomingFilter
      sort: { createdAt: desc }
      first: 5
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
      edges {
        node {
          ...OpportunityFields
        }
      }
    }

    featured: opportunities(
      filter: $featuredFilter
      first: 5
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
      edges {
        node {
          ...OpportunityFields
        }
      }
    }

    similar: opportunities(
      filter: $similarFilter
      first: 3
    ) {
      edges {
        node {
          ...OpportunityFields
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }

    all: opportunities(
      filter: $allFilter
      first: $first
      cursor: $cursor
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
      edges {
        node {
          ...OpportunityFields
          slots {
            ...OpportunitySlotFields
          }
          place {
            ...PlaceFields
          }
        }
      }
    }
  }
  ${OPPORTUNITY_FRAGMENT}
  ${SLOT_FRAGMENT}
  ${PLACE_FRAGMENT}
`;

export const GET_OPPORTUNITY = gql`
  query GetOpportunity($id: ID!, $permission: CheckCommunityPermissionInput!) {
    opportunity(id: $id, permission: $permission) {
      ...OpportunityFields
      
      community {
        ...CommunityFields
      }
      
      place {
        ...PlaceFields
      }
      
      slots {
        id
        startsAt
        endsAt
        remainingCapacity
        reservations {
          status
          participations {
            id
            status
            images
            user {
              id
              name
              image
            }
          }
        }
      }

      createdByUser {
        id
        name
        image

        articlesAboutMe{
          id
          title
          introduction
          thumbnail
          publishedAt
        }

        opportunitiesCreatedByMe {
          id
          title
          description
          images
          
          category
          publishStatus
          requireApproval
          isReservableWithTicket

          pointsToEarn
          feeRequired
          
          community {
            id
          }
          
          slots {
            id
            hostingStatus
            startsAt
            endsAt
            remainingCapacity

            reservations {
              status

              participations {
                id
                status
                images
                user {
                  id
                  name
                  image
                }
              }
            }
          }
        }
      }
    }
  }
  ${OPPORTUNITY_FRAGMENT}
  ${COMMUNITY_FRAGMENT}
  ${PLACE_FRAGMENT}
`; 