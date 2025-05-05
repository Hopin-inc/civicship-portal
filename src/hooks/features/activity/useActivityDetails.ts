'use client';

import { useOpportunity } from '@/hooks/features/activity/useOpportunity';
import { useSimilarOpportunities } from '@/hooks/features/activity/useSimilarOpportunities';
import { useAuth } from '@/contexts/AuthContext';
import { Opportunity } from "@/types";
import {  useEffect } from 'react';
import { useLoading } from '@/hooks/core/useLoading';
import { useAvailableTickets } from "@/hooks/features/ticket/useAvailableTickets";
import { useAvailableDates } from "@/hooks/features/activity/useAvailableDates";

interface UseActivityDetailsProps {
  id: string;
}

interface UseActivityDetailsResult {
  opportunity: Opportunity | null;
  similarOpportunities: Opportunity[];
  availableTickets: number;
  availableDates: Array<{
    startsAt: string;
    endsAt: string;
    participants: number;
    price: number;
  }>;
  loading: boolean;
  error: Error | null;
}

export const useActivityDetails = ({ id }: UseActivityDetailsProps): UseActivityDetailsResult => {
  const { opportunity, loading, error } = useOpportunity(id);
  const { similarOpportunities, loading: similarLoading } = useSimilarOpportunities({
    opportunityId: id
  });
  const { user: currentUser } = useAuth();
  const { setIsLoading } = useLoading();

  const availableTickets = useAvailableTickets(opportunity, currentUser?.id);
  const availableDates = useAvailableDates(opportunity);

  useEffect(() => {
    setIsLoading(loading || similarLoading);
  }, [loading, similarLoading, setIsLoading]);

  return {
    opportunity,
    similarOpportunities,
    availableTickets,
    availableDates,
    loading: loading || similarLoading,
    error
  };
};