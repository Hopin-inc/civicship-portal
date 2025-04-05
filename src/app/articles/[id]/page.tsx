'use client';

import { ArticleDetail } from '@/app/components/features/article/ArticleDetail';
import { useArticle } from '@/hooks/useArticle';
import { useSearchParams } from 'next/navigation';
import { useEffect, useCallback } from "react";
import { useHeader } from "@/contexts/HeaderContext";

export default function ArticlePage({
  params,
}: {
  params: { id: string };
}) {
  const searchParams = useSearchParams();
  const communityId = searchParams.get('community_id') || 'community_id';
  
  const { article, recommendedArticles, loading, error } = useArticle(params.id, communityId);
  const { updateConfig, resetConfig } = useHeader();

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

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-8">Loading...</div>;
  }

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