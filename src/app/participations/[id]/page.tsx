"use client";

import { useEffect } from "react";
import { useParticipation } from "@/hooks/features/participation/useParticipation";
import { useParticipationImageUpload } from "@/hooks/features/participation/useParticipationImageUpload";
import { ParticipationStatus } from "@/gql/graphql";
import { useHeaderConfig } from "@/hooks/core/useHeaderConfig";
import { useParticipationState } from "@/hooks/features/participation/useParticipationState";
import { calculateCancellationDeadline } from "@/utils/participationUtils";
import { LoadingIndicator } from "@/app/components/shared/LoadingIndicator";
import { ErrorState } from "@/app/components/shared/ErrorState";
import { ParticipationStatusNotification } from "@/app/components/features/participation/ParticipationStatusNotification";
import { NotificationMessage } from "@/app/components/features/participation/NotificationMessage";
import { ParticipationHeader } from "@/app/components/features/participation/ParticipationHeader";
import { ParticipationDetails } from "@/app/components/features/participation/ParticipationDetails";
import { ParticipationImageGallery } from "@/app/components/features/participation/ParticipationImageGallery";
import { ParticipationActions } from "@/app/components/features/participation/ParticipationActions";

interface ParticipationProps {
  params: {
    id: string;
  };
}

export default function ParticipationPage({ params }: ParticipationProps) {
  const { participation, opportunity, loading, error, refetch } = useParticipation(params.id);
  
  useHeaderConfig({
    title: opportunity?.title ? `${opportunity.title} - 予約詳細` : "予約詳細",
    showBackButton: true,
    showLogo: false,
    showSearchForm: false,
  });
  
  const {
    currentStatus,
    uploadSuccess,
    uploadError,
    isAddPhotosModalOpen,
    handleUploadSuccess,
    handleUploadError,
    togglePhotosModal,
  } = useParticipationState({
    participation,
    onUploadSuccess: refetch,
  });

  const { uploadImages, isUploading } = useParticipationImageUpload({
    participationId: params.id,
    onSuccess: handleUploadSuccess,
    onError: handleUploadError,
  });

  const handleAddPhotos = async (images: File[], comment: string) => {
    try {
      await uploadImages(images, comment);
    } catch (error) {
      console.error("Error uploading photos:", error);
    }
  };

  if (loading) {
    return <LoadingIndicator message="参加情報を読み込み中..." />;
  }

  if (error || !opportunity || !participation) {
    return <ErrorState message="参加情報の読み込みに失敗しました。" />;
  }

  const participationSlot = participation.node.reservation?.opportunitySlot;
  const startTime = participationSlot?.startsAt ? new Date(participationSlot.startsAt) : new Date();
  const endTime = participationSlot?.endsAt ? new Date(participationSlot.endsAt) : new Date();
  const participantCount = participation.node.reservation?.participations?.length || 0;
  
  const cancellationDeadline = calculateCancellationDeadline(startTime);
  
  const isCancellable = false;

  return (
    <div className="max-w-2xl mx-auto p-4 pb-[120px]">
      {/* Success message */}
      {uploadSuccess && (
        <NotificationMessage
          type="success"
          title="写真が正常にアップロードされました"
        />
      )}

      {/* Error message */}
      {uploadError && (
        <NotificationMessage
          type="error"
          title="写真のアップロードに失敗しました"
          message={uploadError}
        />
      )}

      {/* Status notification */}
      {currentStatus && (
        <ParticipationStatusNotification
          status={currentStatus.status}
          statusText={currentStatus.statusText}
          statusSubText={currentStatus.statusSubText}
          statusClass={currentStatus.statusClass}
        />
      )}
      
      {/* Header section */}
      <ParticipationHeader opportunity={opportunity} />
      
      {/* Details section */}
      <ParticipationDetails
        opportunity={opportunity}
        participation={participation}
        startTime={startTime}
        endTime={endTime}
        participantCount={participantCount}
      />
      
      {/* Image gallery section */}
      {participation?.node?.images && participation.node.images.length > 0 && (
        <ParticipationImageGallery
          images={participation.node.images}
          onViewAllImages={() => console.log(`残りの画像枚数: ${Math.max(0, participation.node.images?.length ?? 0 - 3)}枚`)}
        />
      )}
      
      {/* Actions section */}
      <ParticipationActions
        opportunity={opportunity}
        participation={participation}
        cancellationDeadline={cancellationDeadline}
        isCancellable={isCancellable}
        isUploading={isUploading}
        onAddPhotos={handleAddPhotos}
      />
    </div>
  );
}
