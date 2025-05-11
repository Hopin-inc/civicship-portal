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