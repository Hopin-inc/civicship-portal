import { gql } from "@apollo/client";

const OPPORTUNITY_FRAGMENT = gql`
  fragment OpportunityFields on Opportunity {
    id
    title
    description
    images
    feeRequired
    pointsToEarn
    isReservableWithTicket
    community {
      id
      name
      image
    }
    place {
      id
      name
      address
      city {
        name
        state {
          name
        }
      }
    }
    slots {
      id
      startsAt
      endsAt
      capacity
    }
  }
`;

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
        }
      }
    }
  }
  ${OPPORTUNITY_FRAGMENT}
`;

export const GET_OPPORTUNITY = gql`
  query GetOpportunity($id: ID!, $permission: CheckCommunityPermissionInput!) {
    opportunity(id: $id, permission: $permission) {
      id
      title
      description
      body
      category
      capacity
      pointsToEarn
      isReservableWithTicket
      feeRequired
      requireApproval
      publishStatus
      images
      createdAt
      updatedAt
      community {
        id
        name
        image
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
          createdAt
        }
        opportunitiesCreatedByMe {
          id
          title
          description
          category
          capacity
          community {
            id
            name
            image
          }
          pointsToEarn
          feeRequired
          requireApproval
          publishStatus
          images
          createdAt
          updatedAt
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
        }
      }
      place {
        id
        name
        address
        latitude
        longitude
        city {
          name
          state {
            name
          }
        }
      }
      requiredUtilities {
        id
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
    }
  }
`; 