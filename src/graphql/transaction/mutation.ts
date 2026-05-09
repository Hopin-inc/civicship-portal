import { gql } from "@apollo/client";

export const ISSUE_POINT = gql`
  mutation pointIssue($input: TransactionIssueCommunityPointInput!) {
    transactionIssueCommunityPoint(input: $input) {
      ... on TransactionIssueCommunityPointSuccess {
        transaction {
          ...TransactionFields
        }
      }
    }
  }
`;

export const GRANT_POINT = gql`
  mutation pointGrant($input: TransactionGrantCommunityPointInput!) {
    transactionGrantCommunityPoint(input: $input) {
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
    $permission: CheckIsSelfPermissionInput
  ) {
    transactionUpdateMetadata(id: $id, input: $input, permission: $permission) {
      ... on TransactionUpdateMetadataSuccess {
        transaction {
          id
          comment
          images
        }
      }
    }
  }
`;
