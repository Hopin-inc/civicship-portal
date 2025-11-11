import { PresentedMember } from "../types/PresentedMember";
import Image from "next/image";

interface MemberCardProps {
  member: PresentedMember;
}

export function MemberCard({ member }: MemberCardProps) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="flex-shrink-0">
        {member.image ? (
          <Image
            src={member.image}
            alt={member.name}
            width={48}
            height={48}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 text-sm">👤</span>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm text-gray-900">{member.name}</p>
        <p className="text-sm text-gray-700 mt-1">{member.headline}</p>
      </div>
    </div>
  );
}
