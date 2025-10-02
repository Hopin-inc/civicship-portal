import { gql } from "@apollo/client";

export const MEMBERSHIP_FRAGMENT = gql`
  fragment MembershipFields on Membership {
    headline
    bio

    role
    status
    reason
  }
`;
