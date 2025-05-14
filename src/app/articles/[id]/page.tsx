"use client";

import ArticleDetail from "@/app/articles/[id]/components/ArticleDetail";
import { useArticle } from "@/app/articles/hooks/useArticle";
import { useEffect, useMemo } from "react";
import { useLoading } from "@/hooks/useLoading";
import { ErrorState } from "@/components/shared/ErrorState";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import useHeaderConfig from "@/hooks/useHeaderConfig";

export default function ArticlePage({ params }: { params: { id: string } }) {
  const { article, recommendedArticles, loading, error } = useArticle(params.id);
  const { setIsLoading } = useLoading();

  const initialLoading = loading && !article;

  const headerConfig = useMemo(
    () => ({
      title: article?.title,
      hideHeader: true,
    }),
    [article],
  );
  useHeaderConfig(headerConfig);

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
