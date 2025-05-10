'use client';

import { useState, useEffect } from 'react';
import { useOpportunityQuery } from './useOpportunityQuery';
import { presenterActivityDetail } from "@/presenters/opportunity";
import { ActivityDetail } from "@/types/opportunity";

interface UseOpportunityControllerResult {
  opportunity: ActivityDetail | null;
  loading: boolean;
  error: Error | null;
}

export const useOpportunityController = (id: string): UseOpportunityControllerResult => {
  const [opportunity, setOpportunity] = useState<ActivityDetail | null>(null);
  
  const { data, loading, error } = useOpportunityQuery(id);
  
  useEffect(() => {
    if (data?.opportunity) {
      const opportunity = presenterActivityDetail(data.opportunity);
      setOpportunity(opportunity);
    }
  }, [data]);
  
  return {
    opportunity,
    loading,
    error: error || null,
  };
};
