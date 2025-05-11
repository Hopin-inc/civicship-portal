import Image from "next/image";
import { Participant } from "@/types/utils";

const MAX_DISPLAY_PARTICIPANTS = 3;

interface ParticipantsListProps {
  participants: Participant[];
  size?: 'sm' | 'md';
}

export const ParticipantsList = ({ participants, size = 'sm' }: ParticipantsListProps) => {
  const uniqueParticipants = Array.from(
    new Map(participants.map(p => [p.id, p])).values()
  );
  const remainingCount = uniqueParticipants.length - MAX_DISPLAY_PARTICIPANTS;
  const displayParticipants = uniqueParticipants.slice(0, MAX_DISPLAY_PARTICIPANTS);

  const avatarSize = size === 'sm' ? 'w-6 h-6' : 'w-8 h-8';

  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {displayParticipants.map((participant, index) => (
          <div 
            key={`${participant.id}-${index}`}
            className={`${avatarSize} relative ${index === MAX_DISPLAY_PARTICIPANTS - 1 && remainingCount > 0 ? 'relative' : ''}`}
          >
            <Image
              src={participant.image ?? '/placeholder-avatar.png'}
              alt={participant.name}
              fill
              className={`rounded-full border-2 border-white ${index === MAX_DISPLAY_PARTICIPANTS - 1 && remainingCount > 0 ? 'brightness-50' : ''}`}
            />
            {index === MAX_DISPLAY_PARTICIPANTS - 1 && remainingCount > 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                +{remainingCount}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}; 