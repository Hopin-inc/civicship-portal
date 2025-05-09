'use client';

import { useOpportunity } from '@/hooks/features/activity/useOpportunity';
import { useSimilarOpportunitiesQuery } from '@/hooks/features/activity/useSimilarOpportunitiesQuery';
import { useAvailableTickets } from "@/hooks/features/ticket/useAvailableTickets";
import { useAvailableDatesQuery } from "@/hooks/features/activity/useAvailableDatesQuery";
import { GqlOpportunity } from "@/types/graphql";

interface UseActivityDetailsQueryProps {
  id: string;
  userId?: string;
}

export interface UseActivityDetailsQueryResult {
  opportunity: GqlOpportunity | null;
  similarOpportunities: GqlOpportunity[];
  availableTickets: number;
  availableDates: Array<{
    startsAt: string;
    endsAt: string;
    participants: number;
    price: number;
  }>;
  loading: boolean;
  similarLoading: boolean;
  error: Error | null;
}

/**
 * Hook for fetching activity details data
 * Responsible only for data fetching and transformation, not UI control
 */
export const useActivityDetailsQuery = ({ 
  id, 
  userId 
}: UseActivityDetailsQueryProps): UseActivityDetailsQueryResult => {
  const { opportunity, loading, error } = useOpportunity(id);
  const { similarOpportunities, loading: similarLoading } = useSimilarOpportunitiesQuery({
    opportunityId: id
  });

  const availableTickets = useAvailableTickets(opportunity, userId);
  const { availableDates } = useAvailableDatesQuery(opportunity);

  return {
    opportunity,
    similarOpportunities,
    availableTickets,
    availableDates,
    loading,
    similarLoading,
    error
  };
};
