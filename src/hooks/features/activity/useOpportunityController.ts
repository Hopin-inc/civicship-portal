'use client';

import { useState, useEffect } from 'react';
import { useOpportunityQuery } from './useOpportunityQuery';
import { transformOpportunity } from '../../../lib/transformers/opportunity';
import type { Opportunity } from '../../../types';

interface UseOpportunityControllerResult {
  opportunity: Opportunity | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Controller hook for opportunity data
 * Combines data fetching and transformation
 * @param id Opportunity ID to fetch
 */
export const useOpportunityController = (id: string): UseOpportunityControllerResult => {
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  
  const { data, loading, error } = useOpportunityQuery(id);
  
  useEffect(() => {
    if (data?.opportunity) {
      const transformedOpportunity = transformOpportunity(data.opportunity);
      setOpportunity(transformedOpportunity);
    }
  }, [data]);
  
  return {
    opportunity,
    loading,
    error: error || null,
  };
};
