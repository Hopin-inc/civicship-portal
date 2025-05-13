'use client';

import { useEffect, useMemo } from "react";
import { useArticleQuery } from './useArticleQuery';
import { presenterArticleCard, presenterArticleDetail } from '@/app/articles/data/presenter';
import type { TArticleDetail, TArticleCard } from "@/app/articles/data/type";
import { toast } from 'sonner';

interface UseArticleResult {
  article: TArticleDetail | null;
  recommendedArticles: TArticleCard[];
  loading: boolean;
  error: Error | null;
}

export const useArticle = (id: string): UseArticleResult => {
  const { data, loading, error } = useArticleQuery(id);

  const article = useMemo(() => {
    return data?.article ? presenterArticleDetail(data.article) : null;
  }, [data]);

  const recommendedArticles = useMemo(() => {
    return (
      data?.articles?.edges
        ?.map(edge => edge?.node)
        .filter((node): node is NonNullable<typeof node> => !!node && node.id !== article?.id)
        .map(presenterArticleCard) ?? []
    );
  }, [data?.articles?.edges, article?.id]);

  useEffect(() => {
    if (error) {
      console.error('Error fetching article data:', error);
      toast.error('記事データの取得に失敗しました');
    }
  }, [error]);

  return {
    article,
    recommendedArticles,
    loading,
    error: error || null,
  };
};
