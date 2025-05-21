"use client";

import ArticleDetail from "@/app/articles/[id]/components/ArticleDetail";
import { useArticle } from "@/app/articles/hooks/useArticle";
import { useEffect, useMemo, useRef } from "react";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { notFound, useParams } from "next/navigation";
import ErrorState from "@/components/shared/ErrorState";

export default function ArticlePage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { article, recommendedArticles, isLoading, error, refetch } = useArticle(id ?? "");

  const headerConfig = useMemo(
    () => ({
      title: `${article?.authors?.[0]?.name}さんの記事`,
      showLogo: false,
      showBackButton: true,
    }),
    [article],
  );
  useHeaderConfig(headerConfig);

  const refetchRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  if (isLoading) {
    return <LoadingIndicator />;
  }
  if (error) {
    return <ErrorState title="記事を読み込めませんでした" refetchRef={refetchRef} />;
  }

  if (!article) {
    return notFound();
  }

  return <ArticleDetail article={article} recommendedArticles={recommendedArticles} />;
}
