"use client";

import { useEffect, useMemo } from "react";
import { useArticleQuery } from "./useArticleQuery";
import { presenterArticleDetail, presenterArticleWithAuthor } from "@/app/articles/data/presenter";
import type { TArticleDetail, TArticleWithAuthor } from "@/app/articles/data/type";
import { toast } from "sonner";
import { logger } from "@/lib/logging";

interface UseArticleResult {
  article: TArticleDetail | null;
  recommendedArticles: TArticleWithAuthor[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useArticle = (id: string): UseArticleResult => {
  const { data, loading, error, refetch } = useArticleQuery(id);

  const article = useMemo(() => {
    return data?.article ? presenterArticleDetail(data.article) : null;
  }, [data]);

  const recommendedArticles = useMemo(() => {
    return (
      data?.articles?.edges
        ?.map((edge) => edge?.node)
        .filter((node): node is NonNullable<typeof node> => !!node && node.id !== article?.id)
        .map(presenterArticleWithAuthor) ?? []
    );
  }, [data?.articles?.edges, article?.id]);

  useEffect(() => {
    if (error) {
      logger.warn("Error fetching article data", {
        error: error.message,
        component: "useArticle",
        articleId: id
      });
      toast.error("記事データの取得に失敗しました");
    }
  }, [error, id]);

  return {
    article,
    recommendedArticles,
    isLoading: loading,
    error: error || null,
    refetch,
  };
};
