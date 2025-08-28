import { gql } from "@apollo/client";
import { MEMBERSHIP_FRAGMENT } from "@/graphql/account/membership/fragment";

export const GET_CURRENT_USER = gql`
  query currentUser {
    currentUser {
      user {
        id
        name
        memberships {
          ...MembershipFields
          user {
            id
            name
          }
          community {
            id
            name
          }
          role
          status
        }
      }
    }
  }
  ${MEMBERSHIP_FRAGMENT}
`;

export const CHECK_PHONE_TOKEN_REGISTERED = gql`
  query checkPhoneTokenRegistered {
    checkPhoneTokenRegistered {
      hasValidTokens
      missingTokens
      phoneUid
      message
    }
  }
`;

export const RECOVER_PHONE_AUTH_TOKEN = gql`
  mutation recoverPhoneAuthToken($input: RecoverPhoneAuthTokenInput!) {
    recoverPhoneAuthToken(input: $input) {
      success
      expiresAt
      message
    }
  }
`;
