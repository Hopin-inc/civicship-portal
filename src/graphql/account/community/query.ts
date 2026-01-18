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

export const GET_COMMUNITY_PORTAL_CONFIG = gql`
  query GetCommunityPortalConfig($communityId: String!) {
    communityPortalConfig(communityId: $communityId) {
      communityId
      tokenName
      title
      description
      shortDescription
      domain
      faviconPrefix
      logoPath
      squareLogoPath
      ogImagePath
      enableFeatures
      rootPath
      adminRootPath
      documents {
        id
        title
        path
        type
        order
      }
      commonDocumentOverrides {
        terms {
          id
          title
          path
          type
        }
        privacy {
          id
          title
          path
          type
        }
      }
      regionName
      regionKey
      liffId
      liffAppId
      liffBaseUrl
      firebaseTenantId
    }
  }
`;  