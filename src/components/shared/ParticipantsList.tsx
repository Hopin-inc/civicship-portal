"use client";

import { Participant } from "@/types/utils";
import { PLACEHOLDER_IMAGE } from "@/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const MAX_DISPLAY_PARTICIPANTS = 4;

interface ParticipantsListProps {
  participants: Participant[];
  size?: "sm" | "md";
}

export const ParticipantsList = ({ participants, size = "sm" }: ParticipantsListProps) => {
  const uniqueParticipants = Array.from(new Map(participants.map((p) => [p.id, p])).values());
  const remainingCount = uniqueParticipants.length - MAX_DISPLAY_PARTICIPANTS + 1;
  const displayParticipants = uniqueParticipants.slice(0, MAX_DISPLAY_PARTICIPANTS);

  const avatarSize = size === "sm" ? "w-6 h-6" : "w-8 h-8";

  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {displayParticipants.map((participant, index) => {
          if (index === MAX_DISPLAY_PARTICIPANTS - 1 && remainingCount > 0) {
            return null;
          }

          return (
            <Avatar
              key={`${participant.id}-${index}`}
              className={`${avatarSize} border-2 border-background`}
            >
              <AvatarImage src={participant.image ?? PLACEHOLDER_IMAGE} alt={participant.name} />
              <AvatarFallback>{participant.name?.[0] ?? "U"}</AvatarFallback>
            </Avatar>
          );
        })}

        {remainingCount > 0 && (
          <div
            className={`${avatarSize} relative flex items-center justify-center rounded-full bg-ring border-2 border-background`}
          >
            <span className="text-caption text-xs font-medium">+{remainingCount}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticipantsList;
