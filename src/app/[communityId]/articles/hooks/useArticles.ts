"use client";

import { useEffect, useMemo } from "react";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useLoading } from "@/hooks/useLoading";
import { GqlSortDirection as SortDirection, useGetArticlesQuery } from "@/types/graphql";
import { presenterArticleWithAuthorList } from "@/app/[communityId]/articles/data/presenter";
import { TArticleWithAuthor } from "@/app/[communityId]/articles/data/type";

export const ARTICLES_PER_PAGE = 10;

interface UseArticlesResult {
  articles: TArticleWithAuthor[];
  loading: boolean;
  initialLoading: boolean;
  error: Error | null;
  loadMoreRef: (node: HTMLDivElement | null) => void;
  hasMore: boolean;
}

export const useArticles = (): UseArticlesResult => {
  const { setIsLoading } = useLoading();

  const { data, loading, error, fetchMore } = useGetArticlesQuery({
    variables: {
      first: ARTICLES_PER_PAGE,
      filter: { publishStatus: ["PUBLIC"] },
      sort: { publishedAt: SortDirection.Desc },
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  const articles = useMemo(() => {
    return data?.articles?.edges ? presenterArticleWithAuthorList(data.articles.edges as any) : [];
  }, [data]);

  const hasMore = data?.articles.pageInfo.hasNextPage || false;

  const handleLoadMore = async () => {
    if (!hasMore || loading) return;

    await fetchMore({
      variables: {
        first: ARTICLES_PER_PAGE,
        filter: { publishStatus: ["PUBLIC"] },
        sort: { publishedAt: SortDirection.Desc },
        cursor: data?.articles.pageInfo.endCursor,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          ...prev,
          articles: {
            ...prev.articles,
            edges: [...(prev.articles.edges ?? []), ...(fetchMoreResult.articles.edges ?? [])],
            pageInfo: fetchMoreResult.articles.pageInfo,
          },
        } as any;
      },
    });
  };

  const loadMoreRef = useInfiniteScroll({
    hasMore,
    isLoading: loading,
    onLoadMore: handleLoadMore,
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
