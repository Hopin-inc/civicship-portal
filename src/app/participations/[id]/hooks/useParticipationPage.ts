"use client";

import { useEffect, useMemo, useRef } from "react";
import { useGetParticipationQuery } from "@/types/graphql";
import {
  calculateCancellationDeadline,
  presenterParticipation,
} from "@/app/participations/[id]/data/presenter";
import { presenterActivityCard } from "@/app/activities/data/presenter";
import { useParticipationState } from "@/app/participations/[id]/hooks/useParticipationState";
import type { ParticipationDetail } from "@/app/participations/[id]/data/type";
import type { ReservationStatus } from "@/types/participationStatus";
import type { ActivityCard } from "@/app/activities/data/type";
import type { ApolloError } from "@apollo/client";

interface UseParticipationPageResult {
  participation: ParticipationDetail | null;
  opportunity: ActivityCard | null;
  currentStatus: ReservationStatus | null;
  cancellationDeadline: Date | null;
  loading: boolean;
  error: ApolloError | undefined;
  hasError: boolean; // ← serialize-safe
}

const useParticipationPage = (id: string): UseParticipationPageResult => {
  const { data, loading, error, refetch } = useGetParticipationQuery({
    variables: { id },
    skip: !id,
    fetchPolicy: "network-only",
  });

  const refetchRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  const rawParticipation = data?.participation;
  const rawOpportunity = rawParticipation?.reservation?.opportunitySlot?.opportunity;

  const participation = rawParticipation ? presenterParticipation(rawParticipation) : null;
  const opportunity = rawOpportunity ? presenterActivityCard(rawOpportunity) : null;

  const { currentStatus } = useParticipationState({ participation });

  const { startsAt } = participation?.slot ?? {};

  const cancellationDeadline = useMemo(() => {
    return calculateCancellationDeadline(startsAt);
  }, [startsAt]);

  useEffect(() => {
    if (error) {
      console.error("Participation query error:", error);
    }
  }, [error]);

  return {
    participation,
    opportunity,
    currentStatus,
    cancellationDeadline,
    loading,
    error,
    hasError: Boolean(error), // ← serialize-safe
  };
};

export default useParticipationPage;
