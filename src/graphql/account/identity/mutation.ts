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

export const LINK_PHONE_AUTH = gql(`
  mutation linkPhoneAuth($input: LinkPhoneAuthInput!) {
    linkPhoneAuth(input: $input) {
      success
      user {
        id
        name
      }
    }
  }
`);
