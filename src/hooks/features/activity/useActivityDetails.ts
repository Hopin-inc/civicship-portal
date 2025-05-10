'use client';

import { useActivityDetailsQuery } from '@/hooks/features/activity/useActivityDetailsQuery';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { useLoading } from '@/hooks/core/useLoading';
import { ActivityCard, ActivityDetail } from "@/types/opportunity";

interface UseActivityDetailsProps {
  id: string;
}

interface UseActivityDetailsResult {
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
  error: Error | null;
}

export const useActivityDetails = ({ id }: UseActivityDetailsProps): UseActivityDetailsResult => {
  const { user: currentUser } = useAuth();
  const { setIsLoading } = useLoading();
  
  const { 
    opportunity, 
    similarOpportunities, 
    availableTickets,
    availableDates,
    loading,
    similarLoading,
    error 
  } = useActivityDetailsQuery({ 
    id, 
    userId: currentUser?.id 
  });

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
