'use client';

import { useSimilarOpportunitiesQuery } from '@/hooks/features/activity/useSimilarOpportunitiesQuery';
import { GqlOpportunity } from "@/types/graphql";

interface UseSimilarOpportunitiesProps {
  opportunityId: string;
}

interface UseSimilarOpportunitiesResult {
  similarOpportunities: GqlOpportunity[];
  loading: boolean;
  error: any;
}

/**
 * Hook for similar opportunities
 * This is a wrapper around useSimilarOpportunitiesQuery
 * for backward compatibility
 */
export const useSimilarOpportunities = ({
  opportunityId,
}: UseSimilarOpportunitiesProps): UseSimilarOpportunitiesResult => {
  const { similarOpportunities, loading, error } = useSimilarOpportunitiesQuery({
    opportunityId
  });

  return {
    similarOpportunities,
    loading,
    error,
  };
};       