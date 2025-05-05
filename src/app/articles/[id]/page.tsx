'use client';

import { ArticleDetail } from '../../components/features/article/ArticleDetail';
import { useArticle } from '@/hooks/features/article/useArticle';
import { useEffect } from "react";
import { useHeader } from "../../../contexts/HeaderContext";
import { useLoading } from '@/hooks/core/useLoading';
import ErrorState from '../../components/shared/ErrorState';
import ArticleLoadingIndicator from '../../components/features/article/ArticleLoadingIndicator';

export default function ArticlePage({
  params,
}: {
  params: { id: string };
}) {
  const { article, recommendedArticles, loading, error } = useArticle(params.id);
  const { updateConfig, resetConfig } = useHeader();
  const { setIsLoading } = useLoading();

  useEffect(() => {
    if (!article) return;
    
    updateConfig({
      title: `${article.author?.name || 'ユーザー'}さんの記事`,
      showBackButton: true,
      showLogo: false,
      showSearchForm: false,
    });

    return () => resetConfig();
  }, [article, updateConfig, resetConfig]);

  useEffect(() => {
    setIsLoading(loading);
  }, [loading, setIsLoading]);

  if (loading && !article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ArticleLoadingIndicator size="large" />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error.message} />;
  }

  if (!article) {
    return <ErrorState message="記事が見つかりませんでした" title="Not Found" />;
  }

  return (
    <ArticleDetail
      article={article}
      recommendedArticles={recommendedArticles}
    />
  );
}  