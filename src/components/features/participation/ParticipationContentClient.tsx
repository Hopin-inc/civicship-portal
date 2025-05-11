'use client';

import React from 'react';
import { ParticipationDetails } from "@/components/features/participation/ParticipationDetails";
import { NotificationMessage } from "@/components/features/participation/NotificationMessage";
import { ParticipationStatusNotification } from "@/components/features/participation/ParticipationStatusNotification";
import { ParticipationHeader } from "@/components/features/participation/ParticipationHeader";
import { ParticipationImageGallery } from "@/components/features/participation/ParticipationImageGallery";
import { ParticipationActions } from "@/components/features/participation/ParticipationActions";
import { Participation, Opportunity } from "@/types/participation";
import { ReservationStatus } from "@/types/participationStatus";

interface ParticipationContentClientProps {
  opportunity: Opportunity;
  participation: Participation;
  currentStatus: ReservationStatus | null;
  uploadSuccess: boolean;
  uploadError: string | null;
  isUploading: boolean;
  startTime: Date;
  endTime: Date;
  participantCount: number;
  cancellationDeadline: Date;
  onAddPhotos: (images: File[], comment: string) => Promise<void>;
}

export const ParticipationContentClient = ({
  opportunity,
  participation,
  currentStatus,
  uploadSuccess,
  uploadError,
  isUploading,
  startTime,
  endTime,
  participantCount,
  cancellationDeadline,
  onAddPhotos,
}: ParticipationContentClientProps) => {
  const isCancellable = new Date() < cancellationDeadline;

  return (
    <>
      {uploadSuccess && (
        <NotificationMessage
          type="success"
          title="写真が正常にアップロードされました"
        />
      )}

      {uploadError && (
        <NotificationMessage
          type="error"
          title="写真のアップロードに失敗しました"
          message={uploadError}
        />
      )}

      {currentStatus && (
        <ParticipationStatusNotification 
          status={currentStatus.status === "confirmed" ? "confirmed" : 
                 currentStatus.status === "cancelled" ? "cancelled" : "pending"}
          statusText={currentStatus.statusText}
          statusSubText={currentStatus.statusSubText}
          statusClass={currentStatus.statusClass}
        />
      )}

      <ParticipationHeader opportunity={opportunity} />

      <ParticipationDetails
        opportunity={opportunity}
        participation={participation}
        startTime={startTime}
        endTime={endTime}
        participantCount={participantCount}
      />

      {participation?.node?.images?.length > 0 && (
        <ParticipationImageGallery
          images={participation.node.images}
        />
      )}

      <ParticipationActions
        opportunity={opportunity}
        participation={participation}
        cancellationDeadline={cancellationDeadline}
        isCancellable={isCancellable}
        isUploading={isUploading}
        onAddPhotos={onAddPhotos}
      />
    </>
  );
};
