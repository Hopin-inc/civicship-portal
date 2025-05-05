'use client';

import { useSearchResultsController } from './useSearchResultsController';
import type { SearchParams } from '@/transformers/search';

/**
 * Custom hook for managing search results
 * This is a backward-compatible wrapper around useSearchResultsController
 */
export const useSearchResults = (searchParams: SearchParams = {}) => {
  return useSearchResultsController(searchParams);
};

export default useSearchResults;
