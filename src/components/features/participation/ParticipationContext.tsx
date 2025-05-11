'use client';

import {ParticipationDetails} from "@/components/features/participation/ParticipationDetails";
import {NotificationMessage} from "@/components/features/participation/NotificationMessage";
import {ParticipationStatusNotification} from "@/components/features/participation/ParticipationStatusNotification";
import {ParticipationHeader} from "@/components/features/participation/ParticipationHeader";
import {ParticipationImageGallery} from "@/components/features/participation/ParticipationImageGallery";
import {ParticipationActions} from "@/components/features/participation/ParticipationActions";

export const ParticipationContent = ({
   opportunity,
   participation,
   currentStatus,
   uploadSuccess,
   uploadError,
   isUploading,
   handleAddPhotos,
   startTime,
   endTime,
   participantCount,
   cancellationDeadline,
 }: any) => {
  const isCancellable = false;

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
        <ParticipationStatusNotification {...currentStatus} />
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
          onViewAllImages={() =>
            console.log(`残りの画像枚数: ${Math.max(0, participation.node.images.length - 3)}枚`)
          }
        />
      )}

      <ParticipationActions
        opportunity={opportunity}
        participation={participation}
        cancellationDeadline={cancellationDeadline}
        isCancellable={isCancellable}
        isUploading={isUploading}
        onAddPhotos={handleAddPhotos}
      />
    </>
  );
};
