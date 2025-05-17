"use client";

import { useMemo } from "react";
import { useParticipation } from "@/app/participations/[id]/hooks/useParticipation";
import { useParticipationState } from "@/app/participations/[id]/hooks/useParticipationState";
import { calculateCancellationDeadline } from "@/app/participations/[id]/data/presenter";
import type { ParticipationDetail } from "@/app/participations/[id]/data/type";
import type { ReservationStatus } from "@/types/participationStatus";
import type { ApolloError } from "@apollo/client";
import { ActivityCard } from "@/app/activities/data/type";

interface UseParticipationPageResult {
  participation: ParticipationDetail | null;
  opportunity: ActivityCard | null;
  loading: boolean;
  error: ApolloError | undefined;
  currentStatus: ReservationStatus | null;
  cancellationDeadline: Date | null;
  refetch: () => void;
}

export const useParticipationPage = (
  id: string,
): UseParticipationPageResult & { refetch: () => void } => {
  const { participation, opportunity, loading, error, refetch } = useParticipation(id);
  const { currentStatus } = useParticipationState({ participation });

  const { startsAt } = participation?.slot ?? {};

  const cancellationDeadline = useMemo(() => {
    return calculateCancellationDeadline(startsAt);
  }, [startsAt]);

  return {
    participation,
    opportunity,
    loading,
    error,
    currentStatus,
    cancellationDeadline,
    refetch,
  };
};
