"use client";

import { useCommunityMembers } from "../hooks/useCommunityMembers";
import { groupMembersByJoinMonth } from "../presenters/presentMember";
import { MemberListGroupedView } from "./MemberListGroupedView";
import LoadingIndicator from "@/components/shared/LoadingIndicator";

export function MembersTab() {
  const { members, loading, error } = useCommunityMembers();

  if (loading) {
    return <LoadingIndicator fullScreen={false} />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-red-600">メンバーの取得に失敗しました</p>
      </div>
    );
  }

  const groupedMembers = groupMembersByJoinMonth(members);

  return (
    <div className="mt-6">
      <MemberListGroupedView groupedMembers={groupedMembers} />
    </div>
  );
}
