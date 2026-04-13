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

export const TRANSACTION_UPDATE_METADATA = gql`
  mutation TransactionUpdateMetadata(
    $id: ID!
    $input: TransactionUpdateMetadataInput!
    $permission: CheckIsSelfPermissionInput!
  ) {
    transactionUpdateMetadata(id: $id, input: $input, permission: $permission) {
      ... on TransactionUpdateMetadataSuccess {
        transaction {
          id
          images
        }
      }
    }
  }
`;
