'use client';

import { useArticlesController } from './useArticlesController';
import type { Article } from '../../../lib/transformers/article';

interface UseArticlesResult {
  articles: Article[];
  loading: boolean;
  initialLoading: boolean;
  error: Error | null;
  loadMoreRef: React.RefObject<HTMLDivElement>;
  hasMore: boolean;
}

/**
 * Custom hook for fetching and managing articles
 * This is a backward-compatible wrapper around useArticlesController
 */
export const useArticles = (): UseArticlesResult => {
  return useArticlesController();
};

export type { Article };
export { ARTICLES_PER_PAGE } from './useArticlesQuery';
