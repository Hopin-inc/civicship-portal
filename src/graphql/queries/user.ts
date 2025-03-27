import { graphql } from "@/gql";

export const GET_USER_WITH_DETAILS = graphql(`
  query GetUserWithDetails($id: ID!) {
    user(id: $id) {
      id
      name
      image
      bio
      sysRole
      currentPrefecture
      urlFacebook
      urlInstagram
      urlWebsite
      urlX
      urlYoutube
    }
  }
`);

export const GET_USER_PORTFOLIOS = graphql(`
  query GetUserPortfolios(
    $id: ID!,
    $first: Int,
    $after: String,
    $filter: PortfolioFilterInput,
    $sort: PortfolioSortInput
  ) {
    user(id: $id) {
      id
      portfolios(
        first: $first,
        cursor: $after,
        filter: $filter,
        sort: $sort
      ) {
        edges {
          node {
            id
            title
            category
            date
            thumbnailUrl
            source
            place {
              id
              name
            }
            participants {
              id
              name
              image
            }
          }
          cursor
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`);