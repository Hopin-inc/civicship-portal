'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useOpportunity } from '@/hooks/useOpportunity';
import { useSimilarOpportunities } from '@/hooks/features/activity/useSimilarOpportunities';
import { useHeader } from '@/contexts/HeaderContext';

/**
 * Custom hook for managing reservation complete page data and state
 */
export const useReservationComplete = () => {
  const { updateConfig } = useHeader();
  const searchParams = useSearchParams();
  const opportunityId = searchParams.get('opportunity_id');

  const { opportunity, loading: opportunityLoading, error: opportunityError } = useOpportunity(opportunityId || '');
  const { similarOpportunities, loading: similarLoading, error: similarError } = useSimilarOpportunities({ 
    opportunityId: opportunityId || '' 
  });

  useEffect(() => {
    updateConfig({
      title: '申し込み完了',
      showBackButton: true,
      showLogo: false,
    });
  }, [updateConfig]);

  const formatDateTimeInfo = () => {
    if (!opportunity) return null;

    const startDate = new Date(opportunity.startsAt);
    const endDate = new Date(opportunity.endsAt);
    
    const formattedDate = startDate.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });

    const startTime = startDate.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    const endTime = endDate.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    const participantCount = opportunity.participants?.length || 0;
    const totalPrice = (opportunity.feeRequired || 0) * participantCount;

    return {
      formattedDate,
      startTime,
      endTime,
      participantCount,
      totalPrice
    };
  };

  const dateTimeInfo = opportunity ? formatDateTimeInfo() : null;
  const opportunitiesCreatedByHost = opportunity?.createdByUser?.opportunitiesCreatedByMe?.edges || [];
  const isLoading = opportunityLoading || similarLoading;
  const error = opportunityError || similarError;

  return {
    opportunity,
    similarOpportunities,
    opportunitiesCreatedByHost,
    dateTimeInfo,
    isLoading,
    error
  };
};

export default useReservationComplete;
