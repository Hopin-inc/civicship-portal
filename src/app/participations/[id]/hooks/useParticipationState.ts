"use client";

import { useState, useEffect } from "react";
import { getStatusInfo } from "@/app/participations/[id]/data/presenter";
import type { Participation } from "@/app/participations/[id]/data/type";
import { useParticipationImageUploadState } from "@/app/participations/[id]/hooks/useParticipationImageUploadState";
import { ReservationStatus } from "@/types/participationStatus";

interface UseParticipationStateProps {
  participation?: Participation;
  onUploadSuccess?: () => void;
}

export const useParticipationState = ({
  participation,
  onUploadSuccess,
}: UseParticipationStateProps) => {
  const [currentStatus, setCurrentStatus] = useState<ReservationStatus | null>(null);
  const {
    uploadSuccess,
    uploadError,
    isAddPhotosModalOpen,
    handleUploadSuccess,
    handleUploadError,
    togglePhotosModal,
  } = useParticipationImageUploadState();

  useEffect(() => {
    if (participation?.node.status) {
      const statusInfo = getStatusInfo(participation.node.status, participation.node.reason);
      setCurrentStatus(statusInfo);
    }
  }, [participation?.node.status, participation?.node.reason]);

  const handleUploadSuccessWrapper = () => {
    handleUploadSuccess();
    if (onUploadSuccess) {
      onUploadSuccess();
    }
  };

  return {
    currentStatus,
    uploadSuccess,
    uploadError,
    isAddPhotosModalOpen,
    handleUploadSuccess: handleUploadSuccessWrapper,
    handleUploadError,
    togglePhotosModal,
  };
};
