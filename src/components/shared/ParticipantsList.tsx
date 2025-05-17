import Image from "next/image";
import { Participant } from "@/types/utils";
import { PLACEHOLDER_IMAGE } from "@/utils";

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
            <div key={`${participant.id}-${index}`} className={`${avatarSize} relative`}>
              <Image
                src={participant.image ?? PLACEHOLDER_IMAGE}
                alt={participant.name}
                fill
                placeholder={"blur"}
                blurDataURL={PLACEHOLDER_IMAGE}
                className="rounded-full border-2 border-background"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.src = PLACEHOLDER_IMAGE;
                }}
              />
            </div>
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
