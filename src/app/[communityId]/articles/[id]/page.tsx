"use client";

import ArticleDetail from "@/app/[communityId]/articles/[id]/components/ArticleDetail";
import { useArticle } from "@/app/[communityId]/articles/hooks/useArticle";
import { useEffect, useMemo, useRef } from "react";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { notFound, useParams } from "next/navigation";
import { ErrorState } from "@/components/shared";

export default function ArticlePage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { article, recommendedArticles, isLoading, error, refetch } = useArticle(id ?? "");
  const author = article?.relatedUsers?.[0]?.name;

  const headerConfig = useMemo(
    () => ({
      title: author ? `${author}さんの記事` : "記事詳細",
      showLogo: false,
      showBackButton: true,
    }),
    [author],
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
