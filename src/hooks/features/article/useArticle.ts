'use client';

import { useArticleController } from './useArticleController';
import type { Article } from "@/types";
import type { ErrorWithMessage } from '../wallet/useWalletController';

interface UseArticleResult {
  article: Article | null;
  recommendedArticles: Article[];
  loading: boolean;
  error: ErrorWithMessage | null;
}

/**
 * Public API hook for article
 * This is the hook that should be used by components
 */
export const useArticle = (id: string): UseArticleResult => {
  return useArticleController(id);
};                