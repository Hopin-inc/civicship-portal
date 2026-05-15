import { gql } from "@apollo/client";

export const ASSIGN_OWNER = gql`
  mutation assignOwner($input: MembershipSetRoleInput!) {
    membershipAssignOwner(input: $input) {
      ... on MembershipSetRoleSuccess {
        membership {
          ...MembershipFields
        }
      }
    }
  }
`;

export const ASSIGN_MANAGER = gql`
  mutation assignManager($input: MembershipSetRoleInput!) {
    membershipAssignManager(input: $input) {
      ... on MembershipSetRoleSuccess {
        membership {
          ...MembershipFields
        }
      }
    }
  }
`;

export const ASSIGN_MEMBER = gql`
  mutation assignMember($input: MembershipSetRoleInput!) {
    membershipAssignMember(input: $input) {
      ... on MembershipSetRoleSuccess {
        membership {
          ...MembershipFields
        }
      }
    }
  }
`;
