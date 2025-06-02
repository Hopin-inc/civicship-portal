import { gql } from '@apollo/client';

export const GET_COMMUNITIES = gql`
  query GetCommunities {
    communities {
      edges {
        node {
          id
          name
        }
      }
      totalCount
    }
  }
`;

export const GET_COMMUNITY = gql`
  query GetCommunity($id: ID!) {
    community(id: $id) {
      id
      name
    }
  }
`;

export const GET_COMMUNITY_METADATA = gql`
  query GetCommunityMetadata($id: ID!) {
    community(id: $id) {
      id
      name
      image
      description
      siteUrl
      ogImageUrl
      faviconUrl
    }
  }
`;   