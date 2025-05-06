'use client';

import { useActivityDetailsQuery } from '@/hooks/features/activity/useActivityDetailsQuery';
import { useAuth } from '@/contexts/AuthContext';
import { Opportunity } from "@/types";
import { useEffect } from 'react';
import { useLoading } from '@/hooks/core/useLoading';

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

/**
 * Hook for activity details with UI control
 * This is a wrapper around useActivityDetailsQuery with loading state management
 * for backward compatibility
 */
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
