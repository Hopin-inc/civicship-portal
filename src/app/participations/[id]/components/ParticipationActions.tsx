
import React from 'react';
import type { Opportunity, Participation } from '@/app/participations/[id]/data/type';
import { ParticipationActionsClient } from './ParticipationActionsClient';

interface ParticipationActionsProps {
  opportunity: Opportunity;
  participation: Participation;
  cancellationDeadline: Date;
  isCancellable: boolean;
  isUploading: boolean;
  onAddPhotos: (images: File[], comment: string) => void;
}

export const ParticipationActions: React.FC<ParticipationActionsProps> = ({
  opportunity,
  participation,
  cancellationDeadline,
  isCancellable,
  isUploading,
  onAddPhotos,
}) => {
  return (
    <ParticipationActionsClient
      opportunity={opportunity}
      participation={participation}
      cancellationDeadline={cancellationDeadline}
      isCancellable={isCancellable}
      isUploading={isUploading}
      onAddPhotos={onAddPhotos}
    />
  );
};

export default ParticipationActions;
