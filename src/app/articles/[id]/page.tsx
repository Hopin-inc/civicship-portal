"use client";

import ArticleDetail from "@/app/articles/[id]/components/ArticleDetail";
import { useArticle } from "@/app/articles/hooks/useArticle";
import { useEffect } from "react";
import { useHeader } from "@/contexts/HeaderContext";
import { useLoading } from "@/hooks/useLoading";
import { ErrorState } from "@/components/shared/ErrorState";
import LoadingIndicator from "@/components/shared/LoadingIndicator";

export default function ArticlePage({ params }: { params: { id: string } }) {
  const { article, recommendedArticles, loading, error } = useArticle(params.id);
  const { updateConfig, resetConfig } = useHeader();
  const { setIsLoading } = useLoading();

  const initialLoading = loading && !article;

  useEffect(() => {
    if (!article) return;

    updateConfig({
      title: `${article.authors?.[0].name || ""}さんの記事`,
      showBackButton: true,
      showLogo: false,
      showSearchForm: false,
    });
    return () => resetConfig();
  }, [article, updateConfig, resetConfig]);

  useEffect(() => {
    setIsLoading(initialLoading);
  }, [initialLoading, setIsLoading]);

  if (initialLoading) {
    return <LoadingIndicator fullScreen />;
  }
  if (error) {
    return <ErrorState message={error.message} />;
  }
  if (!article) {
    return <ErrorState message="記事が見つかりませんでした" title="Not Found" />;
  }

  return <ArticleDetail article={article} recommendedArticles={recommendedArticles} />;
}
