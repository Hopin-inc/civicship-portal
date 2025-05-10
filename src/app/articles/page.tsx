'use client';

import { ErrorState } from '@/components/shared/ErrorState';
import { ArticleList } from '@/components/features/article/ArticleList';
import { ArticleLoadingIndicator } from '@/components/features/article/ArticleLoadingIndicator';
import { useArticles } from '@/hooks/features/article/useArticles';
import LoadingIndicator from "@/components/shared/LoadingIndicator";

export default function ArticlesPage() {
  const {
    articles,
    loading,
    initialLoading,
    error,
    loadMoreRef,
    hasMore,
  } = useArticles();

  if (initialLoading) {
    return (
      <LoadingIndicator/>
    );
  }

  if (error) {
    return <ErrorState message={error.message} />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      <h1 className="text-2xl font-bold mb-8">記事一覧</h1>
      <ArticleList articles={articles} />
      {hasMore && (
        <div ref={loadMoreRef} className="h-10 flex items-center justify-center">
          {loading && <ArticleLoadingIndicator size="small" />}
        </div>
      )}
    </div>
  );
}
