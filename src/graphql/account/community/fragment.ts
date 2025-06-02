import { gql } from "@apollo/client";

export const COMMUNITY_FRAGMENT = gql`
  fragment CommunityFields on Community {
    id
    name
    image
    description
    siteUrl
    ogImageUrl
    faviconUrl
  }
`;
