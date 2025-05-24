import { gql } from "@apollo/client";

export const ASSIGN_OWNER = gql`
  mutation assignOwner(
    $input: MembershipSetRoleInput!
    $permission: CheckCommunityPermissionInput!
  ) {
    membershipAssignOwner(input: $input, permission: $permission) {
      ... on MembershipSetRoleSuccess {
        membership {
          ...MembershipFields
        }
      }
    }
  }
`;

export const ASSIGN_MANAGER = gql`
  mutation assignManager(
    $input: MembershipSetRoleInput!
    $permission: CheckCommunityPermissionInput!
  ) {
    membershipAssignManager(input: $input, permission: $permission) {
      ... on MembershipSetRoleSuccess {
        membership {
          ...MembershipFields
        }
      }
    }
  }
`;

export const ASSIGN_MEMBER = gql`
  mutation assignMember(
    $input: MembershipSetRoleInput!
    $permission: CheckCommunityPermissionInput!
  ) {
    membershipAssignMember(input: $input, permission: $permission) {
      ... on MembershipSetRoleSuccess {
        membership {
          ...MembershipFields
        }
      }
    }
  }
`;
