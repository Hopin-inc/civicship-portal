import { gql } from "@apollo/client";

export const MEMBERSHIP_FRAGMENT = gql`
  fragment MembershipFields on Membership {
    id
    bio
    headline
    reason
    role
    status
    createdAt
    updatedAt
  }
`; 