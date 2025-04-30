import { graphql } from '@/gql/gql';

export const CurrentUserDocument = graphql(`
  query currentUser {
    currentUser {
      user {
        id
        name
      }
    }
  }
`); 