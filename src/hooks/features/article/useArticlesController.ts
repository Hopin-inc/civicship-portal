'use client';

import { useEffect, useRef } from "react";
import { useArticlesQuery, ARTICLES_PER_PAGE } from "./useArticlesQuery";
import { transformArticles } from "../../../lib/transformers/article";
import { useLoading } from "../../core/useLoading";
import { useInfiniteScroll } from "../../core/useInfiniteScroll";
import { SortDirection } from "../../../gql/graphql";

/**
 * Controller hook for managing articles data and state
 */
export const useArticlesController = () => {
  const { data, loading, error, fetchMore } = useArticlesQuery();
  const { setIsLoading } = useLoading();
  
  const articles = transformArticles(data);
  
  const hasMore = data?.articles.pageInfo.hasNextPage || false;
  const isLoadingMore = loading && !!data;
  
  const handleLoadMore = () => {
    if (!hasMore || loading) return;
    
    fetchMore({
      variables: {
        first: ARTICLES_PER_PAGE,
        filter: {
          publishStatus: ["PUBLIC"],
        },
        sort: {
          publishedAt: SortDirection.Desc,
        },
        cursor: data?.articles.pageInfo.endCursor,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          ...prev,
          articles: {
            ...prev.articles,
            edges: [...prev.articles.edges, ...fetchMoreResult.articles.edges],
            pageInfo: fetchMoreResult.articles.pageInfo,
          },
        };
      },
    });
  };
  
  const loadMoreRef = useInfiniteScroll({
    hasMore,
    isLoading: loading,
    onLoadMore: handleLoadMore
  });
  
  useEffect(() => {
    setIsLoading(loading && !data);
  }, [loading, data, setIsLoading]);
  
  return {
    articles,
    loading,
    initialLoading: loading && !data,
    error: error || null,
    loadMoreRef,
    hasMore,
  };
};
