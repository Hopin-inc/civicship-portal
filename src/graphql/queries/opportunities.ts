import { gql } from '@apollo/client';

const OPPORTUNITY_FRAGMENT = gql`
  fragment OpportunityFields on Opportunity {
    id
    title
    description
    images
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
      edges {
        node {
          id
          startsAt
          endsAt
          capacity
        }
      }
    }
    feeRequired
    pointsToEarn
    isReservableWithTicket
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
    
    featured: opportunities(
      filter: $featuredFilter
      first: 5
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
      edges {
        node {
          ...OpportunityFields
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
  ${OPPORTUNITY_FRAGMENT}
`; 