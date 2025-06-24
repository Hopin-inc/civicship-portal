"use client";

import { useEffect, useMemo } from "react";
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
import { logger } from "@/lib/logging";

interface UseParticipationPageResult {
  participation: ParticipationDetail | null;
  opportunity: ActivityCard | null;
  currentStatus: ReservationStatus | null;
  cancellationDeadline: Date | null;
  loading: boolean;
  hasError: boolean;
  refetch: () => void;
}

const useParticipationPage = (id: string): UseParticipationPageResult => {
  const { data, loading, error, refetch } = useGetParticipationQuery({
    variables: { id: id },
    skip: !id,
    fetchPolicy: "network-only",
  });
  const rawParticipation = data?.participation;
  const rawOpportunity = rawParticipation?.reservation?.opportunitySlot?.opportunity;
  const participation = rawParticipation ? presenterParticipation({ raw: rawParticipation, opportunity: rawOpportunity ?? undefined }) : null;
  const opportunity = rawOpportunity ? presenterActivityCard(rawOpportunity) : null;

  const { currentStatus } = useParticipationState({ participation });

  const { startsAt } = participation?.slot ?? {};

  const cancellationDeadline = useMemo(() => {
    return calculateCancellationDeadline(startsAt);
  }, [startsAt]);

  useEffect(() => {
    if (error) {
      logger.error("Participation query error", {
        error: error.message || String(error),
        participationId: id,
        component: "useParticipationPage"
      });
    }
  }, [error, id]);

  return {
    participation,
    opportunity,
    currentStatus,
    cancellationDeadline,
    loading,
    hasError: Boolean(error),
    refetch,
  };
};

export default useParticipationPage;
