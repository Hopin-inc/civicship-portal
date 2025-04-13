import { graphql } from "@/gql";

export const USER_SIGN_UP = graphql(`
  mutation userSignUp($input: UserSignUpInput!) {
    userSignUp(input: $input) {
      user {
        id
        name
      }
    }
  }
`);