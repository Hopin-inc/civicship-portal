'use client';

import { ArticleDetail } from '@/app/components/features/article/ArticleDetail';
import { useArticle } from '@/hooks/useArticle';
import { useSearchParams } from 'next/navigation';
import { useEffect, useCallback } from "react";
import { useHeader } from "@/contexts/HeaderContext";
import { useLoading } from '@/hooks/useLoading';

export default function ArticlePage({
  params,
}: {
  params: { id: string };
}) {
  const searchParams = useSearchParams();
  const { article, recommendedArticles, loading, error } = useArticle(params.id);
  const { updateConfig, resetConfig } = useHeader();
  const { setIsLoading } = useLoading();

  const updateHeaderConfig = useCallback(() => {
    if (!article) return;
    updateConfig({
      title: `${article.author?.name || 'ユーザー'}さんの記事`,
      showBackButton: true,
      showLogo: false,
      showSearchForm: false,
    });
  }, [article, updateConfig]);

  useEffect(() => {
    updateHeaderConfig();
    return () => resetConfig();
  }, [updateHeaderConfig, resetConfig]);

  useEffect(() => {
    setIsLoading(loading);
  }, [loading, setIsLoading]);

  if (error) {
    return <div className="max-w-4xl mx-auto px-4 py-8">Error: {error.message}</div>;
  }

  if (!article) {
    return <div className="max-w-4xl mx-auto px-4 py-8">Article not found</div>;
  }

  return (
    <ArticleDetail
      article={article}
      recommendedArticles={recommendedArticles}
    />
  );
} 