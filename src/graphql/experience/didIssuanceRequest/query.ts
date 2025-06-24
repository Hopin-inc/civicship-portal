import { gql } from "@apollo/client";
import { DID_ISSUANCE_REQUEST_FRAGMENT } from "./fragment";

export const GET_DID_ISSUANCE_REQUESTS = gql`
  query GetDidIssuanceRequests($userId: ID!) {
    user(id: $userId) {
      didIssuanceRequests {
        ...DidIssuanceRequestFields
      }
    }
  }
  ${DID_ISSUANCE_REQUEST_FRAGMENT}
`;