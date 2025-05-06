import { gql } from '@apollo/client';

export const CurrentUserDocument = gql(`
  query currentUser {
    currentUser {
      user {
        id
        name
      }
    }
  }
`); 