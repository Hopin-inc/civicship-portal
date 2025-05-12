import { gql } from "@apollo/client";

export const GET_CURRENT_USER = gql(`
  query currentUser {
    currentUser {
      user {
        id
        name
        memberships {
          id
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
`);
