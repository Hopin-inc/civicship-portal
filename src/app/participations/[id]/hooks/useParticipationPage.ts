"use client";

import { useMemo } from "react";
import { useParticipation } from "@/app/participations/[id]/hooks/useParticipation";
import { useParticipationState } from "@/app/participations/[id]/hooks/useParticipationState";
import { useParticipationImageUpload } from "@/app/participations/[id]/hooks/useParticipationImageUpload";
import { calculateCancellationDeadline } from "@/app/participations/[id]/data/presenter";
import { Participation, Opportunity } from "@/app/participations/[id]/data/type";
import { ReservationStatus } from "@/types/participationStatus";
import { ApolloError } from "@apollo/client";

interface UseParticipationPageResult {
  participation?: Participation;
  opportunity?: Opportunity;
  loading: boolean;
  error: ApolloError | undefined;
  currentStatus: ReservationStatus | null;
  uploadSuccess: boolean;
  uploadError: string | null;
  isUploading: boolean;
  handleAddPhotos: (images: File[], comment: string) => Promise<void>;
  startTime: Date;
  endTime: Date;
  participantCount: number;
  cancellationDeadline: Date;
}

export const useParticipationPage = (id: string): UseParticipationPageResult => {
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

  const handleErrorAdapter = (error: Error): void => {
    handleUploadError(error.message);
  };

  const { uploadImages, isUploading } = useParticipationImageUpload({
    participationId: id,
    onSuccess: handleUploadSuccess,
    onError: handleErrorAdapter,
  });

  const handleAddPhotos = async (images: File[], comment: string): Promise<void> => {
    try {
      await uploadImages(images, comment);
    } catch (error) {
      console.error("Error uploading photos:", error);
      if (error instanceof Error) {
        handleUploadError(error.message);
      } else {
        handleUploadError("画像のアップロードに失敗しました");
      }
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
