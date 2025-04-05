"use client";

import { useEffect, useRef, useMemo } from "react";
import { useQuery } from "@apollo/client";
import { GET_ARTICLES } from "@/graphql/queries/articles";
import ArticleCard from "../components/features/article/ArticleCard";
import { SortDirection } from "@/gql/graphql";

const ARTICLES_PER_PAGE = 12;

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
        thumbnail: any;
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

export default function ArticlesPage() {
  const loadMoreRef = useRef<HTMLDivElement>(null);

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

  if (loading && !data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-600">エラーが発生しました: {error.message}</p>
      </div>
    );
  }

  const articles = data?.articles.edges.map((edge) => edge.node) ?? [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">記事一覧</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} {...article} />
        ))}
      </div>
      <div ref={loadMoreRef} className="h-10 flex items-center justify-center">
        {loading && (
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
        )}
      </div>
    </div>
  );
}
