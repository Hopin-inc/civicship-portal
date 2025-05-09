import { gql } from '@apollo/client';

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