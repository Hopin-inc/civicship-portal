import { gql } from "@apollo/client";

export const ISSUE_POINT = gql`
  mutation pointIssue(
    $input: TransactionIssueCommunityPointInput!
    $permission: CheckCommunityPermissionInput!
  ) {
    transactionIssueCommunityPoint(input: $input, permission: $permission) {
      ... on TransactionIssueCommunityPointSuccess {
        transaction {
          ...TransactionFields
        }
      }
    }
  }
`;

export const GRANT_POINT = gql`
  mutation pointGrant(
    $input: TransactionGrantCommunityPointInput!
    $permission: CheckCommunityPermissionInput!
  ) {
    transactionGrantCommunityPoint(input: $input, permission: $permission) {
      ... on TransactionGrantCommunityPointSuccess {
        transaction {
          ...TransactionFields
        }
      }
    }
  }
`;

export const DONATE_POINT = gql`
  mutation pointDonate(
    $input: TransactionDonateSelfPointInput!
    $permission: CheckIsSelfPermissionInput!
  ) {
    transactionDonateSelfPoint(input: $input, permission: $permission) {
      ... on TransactionDonateSelfPointSuccess {
        transaction {
          ...TransactionFields
        }
      }
    }
  }
`;
