import { gql } from '@apollo/client';

export const GET_ARTICLES = gql`
  query GetArticles($first: Int, $cursor: String, $filter: ArticleFilterInput, $sort: ArticleSortInput) {
    articles(first: $first, cursor: $cursor, filter: $filter, sort: $sort) {
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
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