import { gql } from "@apollo/client";

export const UTILITY_FRAGMENT = gql`
  fragment UtilityFields on Utility {
    id
    name
    description
    images
    publishStatus
    pointsRequired
  }
`;

export const UTILITY_WITH_OWNER_FRAGMENT = gql`
  fragment UtilityWithOwnerFields on Utility {
    id
    name
    description
    images
    publishStatus
    pointsRequired
    owner {
      id
      name
    }
  }
`; 