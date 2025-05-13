import { gql } from "@apollo/client";
import { ARTICLE_FRAGMENT } from "@/graphql/content/article/fragment";
import { USER_FRAGMENT } from "@/graphql/account/user/fragment";

export const GET_ARTICLES = gql`
  query GetArticles(
    $first: Int
    $cursor: String
    $filter: ArticleFilterInput
    $sort: ArticleSortInput
  ) {
    articles(first: $first, cursor: $cursor, filter: $filter, sort: $sort) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
      edges {
        cursor
        node {
          ...ArticleFields
          authors {
            ...UserFields
          }
        }
      }
    }
  }
  ${ARTICLE_FRAGMENT}
  ${USER_FRAGMENT}
`;

export const GET_ARTICLE = gql`
  query GetArticle($id: ID!, $permission: CheckCommunityPermissionInput!) {
    article(id: $id, permission: $permission) {
      ...ArticleFields
      authors {
        ...UserFields
        opportunitiesCreatedByMe {
          ...OpportunityFields
          place {
            ...PlaceFields
          }
        }
      }
      relatedUsers {
        ...UserFields
      }
    }

    articles(first: 4, filter: { publishStatus: [PUBLIC] }, sort: { publishedAt: desc }) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
      edges {
        cursor
        node {
          ...ArticleFields
          authors {
            ...UserFields
          }
        }
      }
    }
  }
`;
