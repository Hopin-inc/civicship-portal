import { Participation, Opportunity } from "@/app/participations/[id]/data/type";
import { ReservationStatus } from "@/types/participationStatus";
import { ParticipationContentClient } from "./ParticipationContentClient";

interface ParticipationContentProps {
  opportunity: Opportunity;
  participation: Participation;
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
 }: ParticipationContentProps) => {
  return (
    <ParticipationContentClient
      opportunity={opportunity}
      participation={participation}
      currentStatus={currentStatus}
      uploadSuccess={uploadSuccess}
      uploadError={uploadError}
      isUploading={isUploading}
      startTime={startTime}
      endTime={endTime}
      participantCount={participantCount}
      cancellationDeadline={cancellationDeadline}
      onAddPhotos={handleAddPhotos}
    />
  );
};
