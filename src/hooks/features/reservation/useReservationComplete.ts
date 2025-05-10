'use client';

import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useHeader } from '@/contexts/HeaderContext';
import { COMMUNITY_ID } from '@/utils';
import { presenterActivityDetail } from '@/presenters/opportunity';
import { GqlOpportunity, GqlOpportunityEdge, useGetOpportunitiesQuery, useGetOpportunityQuery } from "@/types/graphql";
import { ActivityDetail } from '@/types/opportunity';

export const useReservationComplete = () => {
  const { updateConfig } = useHeader();
  const searchParams = useSearchParams();
  const opportunityId = searchParams.get('opportunity_id') || '';

  const {
    data: opportunityData,
    loading: opportunityLoading,
    error: opportunityError,
  } = useGetOpportunityQuery({
    variables: {
      id: opportunityId,
      permission: { communityId: COMMUNITY_ID },
    },
    skip: !opportunityId,
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
  });

  const opportunity: ActivityDetail | null = useMemo(() => {
    return opportunityData?.opportunity
      ? presenterActivityDetail(opportunityData.opportunity)
      : null;
  }, [opportunityData]);

  const {
    data: similarData,
    loading: similarLoading,
    error: similarError,
  } = useGetOpportunitiesQuery({
    variables: {
      similarFilter: {
        communityIds: [COMMUNITY_ID],
      },
    },
    skip: !opportunityId,
  });

  const similarOpportunities: GqlOpportunity[] = useMemo(() => {
    return (similarData?.similar?.edges ?? [])
      .map((edge: GqlOpportunityEdge) => edge?.node)
      .filter((node): node is GqlOpportunity => !!node);
  }, [similarData]);

  const dateTimeInfo = useMemo(() => {
    if (!opportunity) return null;

    const startDate = new Date(opportunity.startsAt);
    const endDate = new Date(opportunity.endsAt);

    return {
      formattedDate: startDate.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      }),
      startTime: startDate.toLocaleTimeString('ja-JP', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
      endTime: endDate.toLocaleTimeString('ja-JP', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
      participantCount: opportunity.participants?.length || 0,
      totalPrice: (opportunity.feeRequired || 0) * (opportunity.participants?.length || 0),
    };
  }, [opportunity]);

  const opportunitiesCreatedByHost = useMemo(() => {
    return opportunity?.createdByUser?.opportunitiesCreatedByMe?.edges ?? [];
  }, [opportunity]);

  const isLoading = opportunityLoading || similarLoading;
  const error = opportunityError || similarError;

  useEffect(() => {
    updateConfig({
      title: '申し込み完了',
      showBackButton: true,
      showLogo: false,
    });
  }, [updateConfig]);

  return {
    opportunity,
    similarOpportunities,
    opportunitiesCreatedByHost,
    dateTimeInfo,
    isLoading,
    error,
  };
};
