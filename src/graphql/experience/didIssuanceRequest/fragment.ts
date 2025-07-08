import { gql } from "@apollo/client";

export const DID_ISSUANCE_REQUEST_FRAGMENT = gql`
  fragment DidIssuanceRequestFields on DidIssuanceRequest {
    id
    status
    didValue
    requestedAt
    processedAt
    completedAt
    createdAt
    updatedAt
  }
`;