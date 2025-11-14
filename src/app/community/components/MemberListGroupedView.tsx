import { GroupedMembers } from "../types/PresentedMember";
import { MemberCard } from "./MemberCard";

interface MemberListGroupedViewProps {
  groupedMembers: GroupedMembers[];
}

export function MemberListGroupedView({ groupedMembers }: MemberListGroupedViewProps) {
  if (groupedMembers.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-muted-foreground">メンバーがいません</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {groupedMembers.map((group) => (
        <div key={group.yearMonth} className="space-y-2">
          <h3 className="text-sm font-bold text-gray-600 px-4">
            {group.displayLabel}（{group.members.length}人）
          </h3>
          <div className="bg-white divide-y divide-gray-100">
            {group.members.map((member) => (
              <div key={member.id} className="px-4">
                <MemberCard member={member} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
