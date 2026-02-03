"use client";

import { useMemo } from "react";
import { ErrorState } from "@/components/shared";
import ArticleList from "@/app/community/[communityId]/articles/components/ArticleList";
import { useArticles } from "@/app/community/[communityId]/articles/hooks/useArticles";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import useHeaderConfig from "@/hooks/useHeaderConfig";

export default function ArticlesPage() {
  const headerConfig = useMemo(
    () => ({
      title: "記事一覧",
      showBackButton: true,
      showLogo: false,
      backTo: "/",
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  const { articles, loading, initialLoading, error, loadMoreRef, hasMore } = useArticles();

  if (initialLoading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorState title={error.message} />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      <ArticleList articles={articles} />
      {hasMore && (
        <div ref={loadMoreRef} className="h-10 flex items-center justify-center">
          {loading && <LoadingIndicator />}
        </div>
      )}
    </div>
  );
}
