"use client";

import { useMemo } from "react";
import { useParticipation } from "@/app/participations/[id]/hooks/useParticipation";
import { useParticipationState } from "@/app/participations/[id]/hooks/useParticipationState";
import { calculateCancellationDeadline } from "@/app/participations/[id]/data/presenter";
import type { Opportunity, Participation } from "@/app/participations/[id]/data/type";
import type { ReservationStatus } from "@/types/participationStatus";
import type { ApolloError } from "@apollo/client";

interface UseParticipationPageResult {
  participation?: Participation;
  opportunity?: Opportunity;
  loading: boolean;
  error: ApolloError | undefined;
  currentStatus: ReservationStatus | null;
  startTime: Date;
  endTime: Date;
  participantCount: number;
  cancellationDeadline: Date;
  refetch: () => void;
}

export const useParticipationPage = (
  id: string,
): UseParticipationPageResult & { refetch: () => void } => {
  const { participation, opportunity, loading, error, refetch } = useParticipation(id); // ✅ refetch を取得

  const { currentStatus } = useParticipationState({ participation });

  const participationSlot = participation?.node?.reservation?.opportunitySlot;

  const startTime = useMemo(() => {
    return participationSlot?.startsAt ? new Date(participationSlot.startsAt) : new Date();
  }, [participationSlot?.startsAt]);

  const endTime = useMemo(() => {
    return participationSlot?.endsAt ? new Date(participationSlot.endsAt) : new Date();
  }, [participationSlot?.endsAt]);

  const participantCount = participation?.node?.reservation?.participations?.length || 0;

  const cancellationDeadline = useMemo(() => {
    return calculateCancellationDeadline(startTime);
  }, [startTime]);

  return {
    participation,
    opportunity,
    loading,
    error,
    currentStatus,
    startTime,
    endTime,
    participantCount,
    cancellationDeadline,
    refetch,
  };
};
