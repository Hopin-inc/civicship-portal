'use client';

import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useHeader } from '@/contexts/HeaderContext';
import { COMMUNITY_ID } from '@/utils';
import { presenterActivityCards, presenterActivityDetail } from "@/presenters/opportunity";
import {
  useGetOpportunitiesQuery,
  useGetReservationQuery,
} from "@/types/graphql";
import { ActivityCard, ActivityDetail } from "@/types/opportunity";

export const useReservationComplete = () => {
  const { updateConfig } = useHeader();
  const searchParams = useSearchParams();
  const opportunityId = searchParams.get("opportunity_id");
  const reservationId = searchParams.get("reservation_id");

  const { data, loading, error:opportunityError } = useGetReservationQuery({
    variables: { id: reservationId ?? ""},
    skip: !reservationId,
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
  });

  const reservation = data?.reservation ?? null;
  const gqlOpportunitySlot = reservation?.opportunitySlot ?? null;
  const gqlOpportunity = gqlOpportunitySlot?.opportunity ?? null;

  const opportunity: ActivityDetail | null = useMemo(() => {
    return gqlOpportunity ? presenterActivityDetail(gqlOpportunity) : null;
  }, [gqlOpportunity]);

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

  const similarOpportunities: ActivityCard[] = useMemo(() => {
    return presenterActivityCards(similarData?.similar?.edges);
  }, [similarData]);

  const dateTimeInfo = useMemo(() => {
    if (!gqlOpportunity || !gqlOpportunitySlot || !reservation) return null;

    const startDate = new Date(gqlOpportunitySlot.startsAt);
    const endDate = new Date(gqlOpportunitySlot.endsAt);

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
      participantCount: reservation.participations?.length || 0,
      totalPrice: (gqlOpportunity.feeRequired || 0) * (reservation.participations?.length || 0),
    };
  }, [reservation, gqlOpportunitySlot, gqlOpportunity]);

  const isLoading = loading || similarLoading;
  const error: Error | null = (opportunityError || similarError) ?? null;

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
    // opportunitiesCreatedByHost,
    dateTimeInfo,
    isLoading,
    error: error ?? null,
  };
};
