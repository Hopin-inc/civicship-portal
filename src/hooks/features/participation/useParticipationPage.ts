'use client';

import { useMemo } from 'react';
import { useParticipation } from '@/hooks/features/participation/useParticipation';
import { useParticipationState } from '@/hooks/features/participation/useParticipationState';
import { useParticipationImageUpload } from '@/hooks/features/participation/useParticipationImageUpload';
import { calculateCancellationDeadline } from '@/presenters/participation';

export const useParticipationPage = (id: string) => {
  const { participation, opportunity, loading, error, refetch } = useParticipation(id);

  const {
    currentStatus,
    uploadSuccess,
    uploadError,
    isAddPhotosModalOpen,
    handleUploadSuccess,
    handleUploadError,
    togglePhotosModal,
  } = useParticipationState({ participation, onUploadSuccess: refetch });

  const { uploadImages, isUploading } = useParticipationImageUpload({
    participationId: id,
    onSuccess: handleUploadSuccess,
    onError: handleUploadError,
  });

  const handleAddPhotos = async (images: File[], comment: string) => {
    try {
      await uploadImages(images, comment);
    } catch (error) {
      console.error('Error uploading photos:', error);
    }
  };

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
    uploadSuccess,
    uploadError,
    isUploading,
    handleAddPhotos,
    startTime,
    endTime,
    participantCount,
    cancellationDeadline,
  };
};
