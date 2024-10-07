import { graphql } from "@/gql";

export const CREATE_USER = graphql(`
  mutation createUser($input: CreateUserInput!) {
    createUser(input: $input) {
      user {
        id
      }
    }
  }
`);

export const DELETE_USER = graphql(`
  mutation deleteUser {
    deleteUser {
      user {
        id
      }
    }
  }
`);
