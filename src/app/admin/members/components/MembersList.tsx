"use client";

import React from "react";
import { GqlRole, GqlUser } from "@/types/graphql";
import { MemberRow } from "./MemberRow";
import LoadingIndicator from "@/components/shared/LoadingIndicator";

interface Member extends GqlUser {
  role: GqlRole;
  didInfo?: any;
  wallet?: { currentPointView?: { currentPoint: bigint } };
}

interface MembersListProps {
  members: Member[];
  currentUserRole?: GqlRole;
  hasNextPage: boolean;
  isFetchingMore: boolean;
  loadMoreRef: React.RefObject<HTMLDivElement>;
  onRoleChange: (userId: string, userName: string, newRole: GqlRole) => void;
}

export function MembersList({
  members,
  currentUserRole,
  hasNextPage,
  isFetchingMore,
  loadMoreRef,
  onRoleChange,
}: MembersListProps) {
  return (
    <div className="flex flex-col gap-4 mt-4">
      <span className="text-muted-foreground text-label-xs ml-4">
        操作を行うには管理者権限が必要です
      </span>

      {members.length === 0 && (
        <p className="text-sm text-muted-foreground">一致するメンバーが見つかりません</p>
      )}

      {members.map((member) => (
        <MemberRow
          key={member.id}
          user={member}
          role={member.role}
          currentUserRole={currentUserRole}
          onRoleChange={(newRole) => {
            onRoleChange(member.id, member.name ?? "要確認", newRole);
          }}
        />
      ))}

      {hasNextPage && (
        <div ref={loadMoreRef} className="h-8 mt-4 pointer-events-none" aria-hidden="true">
          {isFetchingMore && (
            <div className="flex justify-center items-center">
              <div className="animate-spin h-6 w-6 bg-blue-300 rounded-xl"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
