'use client';

import { useQuery } from "@apollo/client";
import { GET_ARTICLES } from "@/graphql/queries/articles";
import { useEffect, useMemo, useRef } from "react";
import { useLoading } from "@/hooks/core/useLoading";
import { SortDirection } from "@/gql/graphql";

export interface Article {
  id: string;
  title: string;
  introduction: string;
  thumbnail: {
    url: string;
    alt: string;
  } | null;
  publishedAt: string;
  authors: Array<{
    id: string;
    name: string;
    image: string;
  }>;
}

interface GetArticlesData {
  articles: {
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
    edges: Array<{
      node: {
        id: string;
        title: string;
        introduction: string;
        thumbnail: string;
        publishedAt: string;
        authors: Array<{
          id: string;
          name: string;
          image: string;
        }>;
      };
    }>;
  };
}

interface UseArticlesResult {
  articles: Article[];
  loading: boolean;
  initialLoading: boolean;
  error: Error | null;
  loadMoreRef: React.RefObject<HTMLDivElement>;
  hasMore: boolean;
}

export const ARTICLES_PER_PAGE = 12;

export const useArticles = (): UseArticlesResult => {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { setIsLoading } = useLoading();

  const queryVariables = useMemo(() => ({
    first: ARTICLES_PER_PAGE,
    filter: {
      publishStatus: ["PUBLIC"],
    },
    sort: {
      publishedAt: SortDirection.Desc,
    },
  }), []);

  const { data, loading, error, fetchMore } = useQuery<GetArticlesData>(GET_ARTICLES, {
    variables: queryVariables,
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && data?.articles.pageInfo.hasNextPage) {
          fetchMore({
            variables: {
              ...queryVariables,
              cursor: data.articles.pageInfo.endCursor,
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
        }
      },
      { threshold: 0.1 },
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [data?.articles.pageInfo, fetchMore, loading, queryVariables]);

  useEffect(() => {
    setIsLoading(loading && !data);
  }, [loading, data, setIsLoading]);

  const articles = useMemo(() => {
    return data?.articles.edges.map((edge) => {
      const node = edge.node;
      return {
        ...node,
        thumbnail: node.thumbnail ? {
          url: node.thumbnail,
          alt: node.title
        } : null,
      };
    }) ?? [];
  }, [data]);

  return {
    articles,
    loading,
    initialLoading: loading && !data,
    error: error || null,
    loadMoreRef,
    hasMore: data?.articles.pageInfo.hasNextPage || false,
  };
};
