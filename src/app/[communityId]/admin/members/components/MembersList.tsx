"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { presentMember } from "../presenters/presentMember";
import { PresentedMember } from "../presenters/types";
import { RoleChangeDialog } from "./RoleChangeDialog";

interface MembersListProps {
  members: GqlUser[];
  currentUserRole?: GqlRole;
  hasNextPage: boolean;
  isFetchingMore: boolean;
  loadMoreRef: React.Ref<HTMLDivElement>;
  onRoleChange: (userId: string, newRole: GqlRole) => Promise<boolean>;
}

export function MembersList({
  members,
  currentUserRole,
  hasNextPage,
  isFetchingMore,
  loadMoreRef,
  onRoleChange,
}: MembersListProps) {
  const router = useRouter();
  const [targetMember, setTargetMember] = useState<PresentedMember | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // GraphQL → Presented への変換
  const presentedMembers = members.map(presentMember);

  const isOwner = currentUserRole === GqlRole.Owner;

  const handleConfirm = async (newRole: GqlRole) => {
    if (!targetMember) return;

    setIsSubmitting(true);
    const success = await onRoleChange(targetMember.id, newRole);
    setIsSubmitting(false);

    if (success) {
      setTargetMember(null);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4 mt-4">
        <span className="text-muted-foreground text-label-xs ml-4">
          操作を行うには管理者権限が必要です
        </span>

        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>名前</TableHead>
              <TableHead>ポイント</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {presentedMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  一致するメンバーが見つかりません
                </TableCell>
              </TableRow>
            ) : (
              presentedMembers.map((member) => (
                <TableRow
                  key={member.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => router.push(`/users/${member.id}`)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.image ?? ""} alt={member.name} />
                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{member.name}</span>
                        <span className="text-label-xs text-muted-foreground">{member.roleLabel}</span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="text-body-sm">{member.pointsLabel}</span>
                  </TableCell>

                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">メニューを開く</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            setTargetMember(member);
                          }}
                          disabled={!isOwner}
                        >
                          権限を変更
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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

      <RoleChangeDialog
        member={targetMember}
        open={!!targetMember}
        onClose={() => setTargetMember(null)}
        onConfirm={handleConfirm}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
