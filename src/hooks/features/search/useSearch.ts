'use client';

import { useSearchController } from './useSearchController';
import { SearchTabType, SearchFilterType, Prefecture, PREFECTURES } from './useSearchState';

export { SearchTabType, SearchFilterType, Prefecture, PREFECTURES };

/**
 * Custom hook for managing search state and functionality
 * This is a backward-compatible wrapper around useSearchController
 */
export const useSearch = () => {
  return useSearchController();
};

export default useSearch;
