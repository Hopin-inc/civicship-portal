'use client';

import { useState, useEffect } from 'react';
import { ParticipationStatus, ParticipationStatusReason } from "@/gql/graphql";
import { getStatusInfo } from '@/utils/participationUtils';
import type { Participation } from '@/types';

interface UseParticipationStateProps {
  participation?: Participation;
  onUploadSuccess?: () => void;
}

export const useParticipationState = ({ participation, onUploadSuccess }: UseParticipationStateProps) => {
  const [currentStatus, setCurrentStatus] = useState<ReturnType<typeof getStatusInfo>>(null);
  const [isAddPhotosModalOpen, setIsAddPhotosModalOpen] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (participation?.node.status) {
      setCurrentStatus(
        getStatusInfo(
          participation.node.status as ParticipationStatus,
          participation.node.reason as ParticipationStatusReason,
        ),
      );
    }
  }, [participation?.node.status, participation?.node.reason]);

  const handleUploadSuccess = () => {
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 3000);
    if (onUploadSuccess) {
      onUploadSuccess();
    }
  };

  const handleUploadError = (error: Error) => {
    setUploadError(error.message);
    setTimeout(() => setUploadError(null), 3000);
  };

  const togglePhotosModal = (isOpen: boolean) => {
    setIsAddPhotosModalOpen(isOpen);
  };

  return {
    currentStatus,
    uploadSuccess,
    uploadError,
    isAddPhotosModalOpen,
    handleUploadSuccess,
    handleUploadError,
    togglePhotosModal,
  };
};
