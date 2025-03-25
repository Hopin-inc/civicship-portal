import { graphql } from "@/gql";

export const GET_USER_WITH_DETAILS = graphql(`
  query GetUserWithDetails($id: ID!) {
    user(id: $id) {
      id
      name
      image
      bio
      sysRole
      urlFacebook
      urlInstagram
      urlWebsite
      urlX
      urlYoutube
    }
  }
`);

export const GET_USER_ACTIVITIES = graphql(`
  query GetUserActivities($id: ID!, $articlesFirst: Int, $articlesCursor: String) {
    user(id: $id) {
      id
      articlesAboutMe(first: $articlesFirst, cursor: $articlesCursor) {
        edges {
          node {
            id
          }
          cursor
        }
      }
      articlesWrittenByMe(first: $articlesFirst, cursor: $articlesCursor) {
        edges {
          node {
            id
          }
          cursor
        }
      }
    }
  }
`);