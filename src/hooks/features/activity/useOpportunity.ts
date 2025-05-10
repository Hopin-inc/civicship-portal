'use client';

import { useOpportunityController } from './useOpportunityController';
import { ActivityDetail } from "@/types/opportunity";

interface UseOpportunityResult {
  opportunity: ActivityDetail | null;
  loading: boolean;
  error: Error | null;
}

export const useOpportunity = (id: string): UseOpportunityResult => {
  return useOpportunityController(id);
};

