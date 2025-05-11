import { gql } from "@apollo/client";

export const UTILITY_FRAGMENT = gql`
  fragment UtilityFields on Utility {
    id
    name
    description
    images
    pointsRequired
    publishStatus
    createdAt
    updatedAt
  }
`; 