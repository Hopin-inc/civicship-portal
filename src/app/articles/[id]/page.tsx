'use client';

import { ArticleDetail } from '@/app/components/features/article/ArticleDetail';
import { useArticle } from '@/hooks/useArticle';
import { useSearchParams } from 'next/navigation';

export default function ArticlePage({
  params,
}: {
  params: { id: string };
}) {
  const searchParams = useSearchParams();
  const communityId = searchParams.get('community_id') || '1'; // Default to '1' if not provided
  
  const { article, recommendedArticles, loading, error } = useArticle(params.id, communityId);

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