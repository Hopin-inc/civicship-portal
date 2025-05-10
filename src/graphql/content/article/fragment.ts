import { gql } from "@apollo/client";

export const ARTICLE_FRAGMENT = gql`
  fragment ArticleFields on Article {
    id
    title
    body
    introduction
    thumbnail

    category
    publishStatus
    
    publishedAt
  }
`; 