'use client';

import { useRouter } from 'next/navigation';
import { useSearchState } from '@/hooks/features/search/useSearchState';
import { formatDateRange, buildSearchParams } from '@/transformers/search';

/**
 * Controller hook for search functionality
 */
export const useSearchController = () => {
  const router = useRouter();
  const state = useSearchState();
  
  /**
   * Clear all search filters
   */
  const handleClear = () => {
    state.setLocation('');
    state.setDateRange(undefined);
    state.setGuests(0);
    state.setActiveForm(null);
  };

  /**
   * Execute search with current filters
   */
  const handleSearch = () => {
    const params = buildSearchParams(
      state.searchQuery,
      state.location,
      state.dateRange,
      state.guests,
      state.useTicket,
      state.selectedTab
    );
    
    router.push(`/search/result?${params.toString()}`);
  };

  return {
    ...state,
    formatDateRange,
    handleClear,
    handleSearch,
  };
};
