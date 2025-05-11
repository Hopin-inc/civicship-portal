import { gql } from "@apollo/client";

export const IDENTITY_FRAGMENT = gql`
  fragment IdentityFields on Identity {
    uid
    platform
    createdAt
    updatedAt
  }
`; 