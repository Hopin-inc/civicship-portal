import { gql } from "@apollo/client";

export const ARTICLE_FRAGMENT = gql`
  fragment ArticleFields on Article {
    id
    title
    body
    category
    introduction
    thumbnail
    publishStatus
    publishedAt
    createdAt
    updatedAt
  }
`; 