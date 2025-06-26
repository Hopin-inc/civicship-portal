import { gql } from '@apollo/client';

export const USER_SIGN_UP = gql(`
  mutation userSignUp($input: UserSignUpInput!) {
    userSignUp(input: $input) {
      user {
        id
        name
      }
    }
  }
`);

export const STORE_PHONE_AUTH_TOKEN = gql(`
  mutation storePhoneAuthToken($input: StorePhoneAuthTokenInput!) {
    storePhoneAuthToken(input: $input) {
      success
      expiresAt
    }
  }
`);

export const LINK_PHONE_AUTH = gql(`
  mutation linkPhoneAuth($input: LinkPhoneAuthInput!, $permission: CheckIsSelfPermissionInput!) {
    linkPhoneAuth(input: $input, permission: $permission) {
      success
      user {
        id
        name
      }
    }
  }
`);

export const IDENTITY_CHECK_PHONE_USER = gql(`
  mutation identityCheckPhoneUser($input: IdentityCheckPhoneUserInput!) {
    identityCheckPhoneUser(input: $input) {
      status
      user {
        id
        name
      }
      membership {
        id
        role
      }
    }
  }
`);
