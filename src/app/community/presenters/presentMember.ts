import { GqlMembership } from "@/types/graphql";
import { PresentedMember, GroupedMembers } from "../types/PresentedMember";

export function presentMember(membership: GqlMembership): PresentedMember {
  const user = membership.user;
  
  return {
    id: user?.id ?? "",
    name: user?.name ?? "名前未設定",
    image: user?.image ?? null,
    headline: membership.headline ?? membership.bio ?? "やりたいことを設定していません",
    bio: membership.bio ?? null,
    joinedAt: membership.createdAt ?? new Date().toISOString(),
    role: membership.role,
  };
}

export function groupMembersByJoinMonth(
  members: PresentedMember[]
): GroupedMembers[] {
  const grouped = new Map<string, PresentedMember[]>();

  members.forEach((member) => {
    const date = new Date(member.joinedAt);
    const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    
    if (!grouped.has(yearMonth)) {
      grouped.set(yearMonth, []);
    }
    grouped.get(yearMonth)?.push(member);
  });

  const result: GroupedMembers[] = [];
  
  const sortedKeys = Array.from(grouped.keys()).sort((a, b) => b.localeCompare(a));
  
  sortedKeys.forEach((yearMonth) => {
    const [year, month] = yearMonth.split("-");
    const displayLabel = `${year}年${parseInt(month)}月に参加したメンバー`;
    
    result.push({
      yearMonth,
      displayLabel,
      members: grouped.get(yearMonth) ?? [],
    });
  });

  return result;
}
