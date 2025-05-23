"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { COMMUNITY_ID } from "@/utils";
import { GqlRole } from "@/types/graphql";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MemberRow, roleLabels } from "@/app/admin/members/components/MemberRow";
import { useMembershipQueries } from "@/app/admin/members/hooks/useMembershipQueries";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { useMembershipCommand } from "@/app/admin/members/hooks/useMembershipMutations";
import { Button } from "@/components/ui/button";

export default function MembersPage() {
  const communityId = COMMUNITY_ID;
  const { user: currentUser } = useAuth();

  const currentUserRole = currentUser?.memberships?.find(
    (m) => m.community?.id === communityId,
  )?.role;

  const headerConfig = useMemo(
    () => ({
      title: "権限管理",
      showLogo: false,
      showBackButton: true,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  const { fetchMembershipList, membershipListData } = useMembershipQueries();
  const { assignOwner, assignManager, assignMember } = useMembershipCommand();

  const [pendingRoleChange, setPendingRoleChange] = useState<{
    userId: string;
    userName: string;
    newRole: GqlRole;
  } | null>(null);

  const roleMutationMap = {
    OWNER: assignOwner,
    MANAGER: assignManager,
    MEMBER: assignMember,
  };

  useEffect(() => {
    void fetchMembershipList({ variables: { first: 50 } });
  }, [fetchMembershipList]);

  const [isLoading, setIsLoading] = useState(false);

  const handleMutation = useCallback(
    async (mutate: Function, userId: string) => {
      setIsLoading(true); // ✅ 開始時にtrue
      try {
        const result = await mutate({ communityId, userId });
        if (!result.success) {
          toast.error(`権限変更に失敗しました（${result.code ?? "UNKNOWN"}）`);
          return;
        }
        toast.success("ロールを更新しました");
        window.location.reload();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "不明なエラーが発生しました");
      } finally {
        setIsLoading(false); // ✅ 終了時にfalse
      }
    },
    [communityId],
  );

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="space-y-4">
        <span className="text-muted-foreground text-label-xs">
          操作を行うには管理者権限が必要です
        </span>
        {membershipListData?.memberships?.edges?.length === 0 && (
          <p className="text-sm text-muted-foreground">No members found.</p>
        )}
        {membershipListData?.memberships?.edges?.map((edge) => {
          const user = edge?.node?.user;
          const role = edge?.node?.role as GqlRole;
          if (!user?.id) return null;

          return (
            <MemberRow
              key={user.id}
              user={user}
              role={role}
              currentUserRole={currentUserRole}
              onRoleChange={(newRole) => {
                if (currentUserRole !== GqlRole.Owner) {
                  toast.error("この操作を行う権限がありません");
                  return;
                }
                setPendingRoleChange({ userId: user.id, userName: user.name ?? "要確認", newRole });
              }}
            />
          );
        })}
      </div>

      {pendingRoleChange && (
        <Dialog open onOpenChange={(open) => !open && setPendingRoleChange(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>権限変更の確認</DialogTitle>
              <DialogDescription>
                <strong className="px-1">{pendingRoleChange.userName}</strong>
                の権限を
                <strong className="px-1">{roleLabels[pendingRoleChange.newRole]}</strong>
                に変更します。
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="tertiary" size={"sm"}>
                  キャンセル
                </Button>
              </DialogClose>
              <Button
                variant="primary"
                size={"sm"}
                onClick={() => {
                  const mutate = roleMutationMap[pendingRoleChange.newRole];
                  if (mutate) void handleMutation(mutate, pendingRoleChange.userId);
                  setPendingRoleChange(null);
                }}
                disabled={isLoading}
              >
                {isLoading ? "変更中..." : "変更を確定"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
