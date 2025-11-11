"use client";

import { useInfiniteMembers } from "../hooks/useInfiniteMembers";
import { groupMembersByJoinMonth } from "../presenters/presentMember";
import { MemberListGroupedView } from "./MemberListGroupedView";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { GqlMembershipsConnection } from "@/types/graphql";

interface MembersTabProps {
  initialMembers: GqlMembershipsConnection;
}

export function MembersTab({ initialMembers }: MembersTabProps) {
  const { members, hasNextPage, loading, loadMoreRef } = useInfiniteMembers({
    initialMembers,
  });

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
