import { PresentedMember } from "../types/PresentedMember";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MemberCardProps {
  member: PresentedMember;
}

export function MemberCard({ member }: MemberCardProps) {
  const initial = member.name?.charAt(0)?.toUpperCase() ?? "?";

  return (
    <div className="flex items-start gap-3 py-3">
      <Avatar className="w-12 h-12">
        <AvatarImage src={member.image ?? undefined} alt={member.name} />
        <AvatarFallback className="bg-gray-200 text-gray-600 text-sm font-medium">
          {initial}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm text-gray-900">{member.name}</p>
        <p className="text-sm text-gray-700 mt-1 line-clamp-2">{member.headline}</p>
      </div>
    </div>
  );
}
