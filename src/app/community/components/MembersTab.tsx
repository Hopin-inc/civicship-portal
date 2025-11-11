"use client";

import { useInfiniteMembers } from "../hooks/useInfiniteMembers";
import { groupMembersByJoinMonth } from "../presenters/presentMember";
import { MemberListGroupedView } from "./MemberListGroupedView";
import LoadingIndicator from "@/components/shared/LoadingIndicator";

export function MembersTab() {
  const { members, hasNextPage, loading, loadMoreRef } = useInfiniteMembers();

  if (loading && members.length === 0) {
    return <LoadingIndicator fullScreen={false} />;
  }

  const groupedMembers = groupMembersByJoinMonth(members);

  return (
    <div className="mt-6">
      <MemberListGroupedView groupedMembers={groupedMembers} />
      
      {hasNextPage && (
        <div ref={loadMoreRef} className="flex justify-center py-4">
          {loading && <LoadingIndicator fullScreen={false} />}
        </div>
      )}
    </div>
  );
}
