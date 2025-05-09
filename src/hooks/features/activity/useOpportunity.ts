'use client';

import { useOpportunityController } from './useOpportunityController';
import { GqlOpportunity } from "@/types/graphql";

interface UseOpportunityResult {
  opportunity: GqlOpportunity | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook for fetching and transforming opportunity data
 * This is a backward-compatible wrapper around useOpportunityController
 * @param id Opportunity ID to fetch
 */
export const useOpportunity = (id: string): UseOpportunityResult => {
  return useOpportunityController(id);
};

