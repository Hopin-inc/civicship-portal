import { graphql } from "@/gql";

export const GET_CURRENT_USER = graphql(`
  query currentUser {
    currentUser {
      user {
        id
        lastName
        middleName
        firstName
      }
    }
  }
`);
