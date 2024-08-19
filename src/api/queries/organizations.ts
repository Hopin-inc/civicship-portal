import { graphql } from "@/gql";

export const GET_ALL_ORGANIZATIONS = graphql(`
  query organizations($filter: OrganizationFilterInput, $sort: OrganizationSortInput, $cursor: String, $first: Int) {
    organizations(filter: $filter, sort: $sort, cursor: $cursor, first: $first) {
      edges {
        node {
          id
          name
          city {
            name
            state {
              name
            }
          }
          users {
            id
            firstName
            middleName
            lastName
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
