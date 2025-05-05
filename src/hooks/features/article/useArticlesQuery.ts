'use client';

import { useQuery } from "@apollo/client";
import { GET_ARTICLES } from "../../../graphql/queries/articles";
import { SortDirection } from "../../../gql/graphql";

import { GetArticlesData } from "../../../transformers/article";

export const ARTICLES_PER_PAGE = 12;

/**
 * Hook for fetching articles from GraphQL
 */
export const useArticlesQuery = () => {
  const queryVariables = {
    first: ARTICLES_PER_PAGE,
    filter: {
      publishStatus: ["PUBLIC"],
    },
    sort: {
      publishedAt: SortDirection.Desc,
    },
  };

  return useQuery<GetArticlesData>(GET_ARTICLES, {
    variables: queryVariables,
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });
};
