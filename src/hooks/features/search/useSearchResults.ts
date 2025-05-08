'use client';

import { useSearchResultsController } from './useSearchResultsController';
import type { SearchParams } from '@/presenters/search';
import type { OpportunityCardProps } from '@/components/features/opportunity/OpportunityCard';
import type { ErrorWithMessage } from '../wallet/useWalletController';

/**
 * Public API hook for search results
 * This is the hook that should be used by components
 * Provides a stable interface for components while hiding implementation details
 */
export const useSearchResults = (searchParams: SearchParams = {}): {
  opportunities: any;
  recommendedOpportunities: OpportunityCardProps[];
  groupedOpportunities: { [key: string]: OpportunityCardProps[] };
  loading: boolean;
  error: ErrorWithMessage | null;
  hasResults: boolean;
} => {
  return useSearchResultsController(searchParams);
};

export default useSearchResults;
