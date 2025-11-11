"use client";

import React from "react";
import { GqlRole, GqlUser } from "@/types/graphql";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Member extends GqlUser {
  image?: string | null;
  role: GqlRole;
  wallet?: { currentPointView?: { currentPoint: bigint } };
}

interface MembersListProps {
  members: Member[];
  currentUserRole?: GqlRole;
  hasNextPage: boolean;
  isFetchingMore: boolean;
  loadMoreRef: React.Ref<HTMLDivElement>;
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

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>名前</TableHead>
            <TableHead>役割</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {members.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground">
                一致するメンバーが見つかりません
              </TableCell>
            </TableRow>
          ) : (
            members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.image ?? ""} alt={member.name ?? "ユーザー"} />
                      <AvatarFallback>{member.name ? member.name.charAt(0) : "?"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{member.name ?? "名前未設定"}</div>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <select
                    value={member.role}
                    onChange={(e) =>
                      onRoleChange(member.id, member.name ?? "要確認", e.target.value as GqlRole)
                    }
                    className="border rounded-md text-sm px-2 py-1"
                    disabled={currentUserRole !== "OWNER"}
                  >
                    <option value="OWNER">管理者</option>
                    <option value="MEMBER">運用担当者</option>
                    <option value="MANAGER">参加者</option>
                  </select>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

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
