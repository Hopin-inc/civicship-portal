import { gql } from '@apollo/client';

export const GET_ARTICLE = gql`
  query GetArticle($id: ID!, $permission: CheckCommunityPermissionInput!) {
    article(id: $id, permission: $permission) {
      id
      title
      introduction
      body
      category
      thumbnail
      publishedAt
      createdAt
      updatedAt
      authors {
        id
        name
        image
        bio
      }
      relatedUsers {
        id
        name
        image
        bio
      }
    }

    articles(
      first: 4,
      filter: {
        categories: ["INTERVIEW"],
        publishStatus: [PUBLIC]
      },
      sort: { publishedAt: desc }
    ) {
      edges {
        node {
          id
          title
          introduction
          thumbnail
          publishedAt
          authors {
            id
            name
            image
          }
        }
      }
    }
  }
`; 