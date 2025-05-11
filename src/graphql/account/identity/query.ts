import { gql } from "@apollo/client";

export const GET_CURRENT_USER = gql(`
  query currentUser {
    currentUser {
      user {
        id
        name
        memberships {
          user {
            id
          }
          community {
            id
          }
          role
          status
        }
      }
    }
  }
`);
