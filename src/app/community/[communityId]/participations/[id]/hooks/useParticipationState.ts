"use client";

import { useEffect, useState } from "react";
import { getStatusInfo } from "@/app/community/[communityId]/participations/[id]/data/presenter";
import type { ParticipationDetail } from "@/app/community/[communityId]/participations/[id]/data/type";
import { ReservationStatus } from "@/types/participationStatus";

interface UseParticipationStateProps {
  participation: ParticipationDetail | null;
}

export const useParticipationState = ({ participation }: UseParticipationStateProps) => {
  const [currentStatus, setCurrentStatus] = useState<ReservationStatus | null>(null);

  useEffect(() => {
    if (participation?.reservation?.status) {
      const statusInfo = getStatusInfo(participation.reservation.status);
      setCurrentStatus(statusInfo);
    }
  }, [participation?.reservation?.status]);

  return {
    currentStatus,
  };
};
