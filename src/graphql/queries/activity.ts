import { graphql } from "@/gql";

export const GET_ACTIVITIES = graphql(`
  query activities($filter: ActivityFilterInput, $sort: ActivitySortInput, $cursor: String, $first: Int) {
    activities(filter: $filter, sort: $sort, cursor: $cursor, first: $first) {
      edges {
        node {
          id
          description
          remark
          startsAt
          endsAt
          isPublic
          event {
            id
            description
          }
          user {
            id
            firstName
            middleName
            lastName
          }
          organization {
            id
            name
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`);

export const GET_ACTIVITY = graphql(`
  query activity($id: ID!) {
    activity(id: $id) {
      id
      description
      remark
      startsAt
      endsAt
      isPublic
      event {
        id
        description
      }
      user {
        id
        firstName
        middleName
        lastName
      }
      organization {
        id
        name
      }
    }
  }
`);
