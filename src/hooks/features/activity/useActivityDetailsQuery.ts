'use client';

import { useOpportunity } from '@/hooks/features/activity/useOpportunity';
import { useSimilarOpportunitiesQuery } from '@/hooks/features/activity/useSimilarOpportunitiesQuery';
import { useAvailableTickets } from "@/hooks/features/ticket/useAvailableTickets";
import { useAvailableDatesQuery } from "@/hooks/features/activity/useAvailableDatesQuery";
import { ActivityCard, ActivityDetail } from "@/types/opportunity";

interface UseActivityDetailsQueryProps {
  id: string;
  userId?: string;
}

export interface UseActivityDetailsQueryResult {
  opportunity: ActivityDetail | null;
  similarOpportunities: ActivityCard[];
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

export const useActivityDetailsQuery = ({ 
  id, 
  userId 
}: UseActivityDetailsQueryProps): UseActivityDetailsQueryResult => {
  const { opportunity, loading, error } = useOpportunity(id);
  const { similarOpportunities, loading: similarLoading } = useSimilarOpportunitiesQuery({
    opportunityId: id
  });

  const availableTickets = useAvailableTickets(opportunity, userId);
  const { availableDates } = useAvailableDatesQuery(opportunity?.slots);

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
