"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { COMMUNITY_ID } from "@/utils";
import { GqlRole, GqlUser } from "@/types/graphql";
import { toast } from "sonner";
import { getSimpleErrorMessage } from "@/utils/getErrorMessage";
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
import { FormProvider } from "react-hook-form";
import SearchForm from "@/app/search/components/SearchForm";
import { useMemberSearch } from "@/app/admin/wallet/grant/hooks/useMemberSearch";

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

  const members = useMemo(() => {
    return (
      membershipListData?.memberships?.edges
        ?.map((edge) => {
          const user = edge?.node?.user;
          const role = edge?.node?.role;
          return user && role ? { user, role } : null;
        })
        .filter((member): member is { user: GqlUser; role: GqlRole } => member !== null) ?? []
    );
  }, [membershipListData]);

  const { form, filteredMembers } = useMemberSearch(
    members
      .map(({ user }) => (user ? { user } : null))
      .filter((m): m is { user: GqlUser } => m !== null),
  );

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
      setIsLoading(true);
      try {
        const result = await mutate({ communityId, userId });
        if (!result.success) {
          toast.error(`権限変更に失敗しました（${result.code ?? "UNKNOWN"}）`);
          return;
        }
        toast.success("権限を更新しました");
        window.location.reload();
      } catch (err) {
        toast.error(getSimpleErrorMessage(err, "権限変更"));
      } finally {
        setIsLoading(false);
      }
    },
    [communityId],
  );

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(() => {})} className="px-4 mb-4 pt-6">
        <SearchForm name="searchQuery" />
      </form>

      <div className="flex flex-col gap-4 px-4">
        <span className="text-muted-foreground text-label-xs">
          操作を行うには管理者権限が必要です
        </span>

        {filteredMembers.length === 0 && (
          <p className="text-sm text-muted-foreground">一致するメンバーが見つかりません</p>
        )}

        {filteredMembers.map(({ user }) => {
          const membership = members.find((m) => m?.user.id === user.id);
          if (!membership) return null;

          return (
            <MemberRow
              key={user.id}
              user={user}
              role={membership.role}
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
          <DialogContent className="w-[90vw] max-w-[400px] rounded-sm">
            <DialogHeader>
              <DialogTitle className="text-left text-body-sm font-bold pb-2">
                権限の変更を確定しますか？
              </DialogTitle>
              <DialogDescription className="text-left">
                <strong className="px-1">{pendingRoleChange.userName}</strong>
                の権限を
                <strong className="px-1">{roleLabels[pendingRoleChange.newRole]}</strong>
                に変更します。よろしいですか？
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-2">
              <DialogClose asChild>
                <Button variant="tertiary" className="w-full py-4">
                  やめる
                </Button>
              </DialogClose>
              <Button
                variant="primary"
                onClick={() => {
                  const mutate = roleMutationMap[pendingRoleChange.newRole];
                  if (mutate) void handleMutation(mutate, pendingRoleChange.userId);
                  setPendingRoleChange(null);
                }}
                disabled={isLoading}
                className="w-full py-4"
              >
                {isLoading ? "変更中..." : "権限を変更"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </FormProvider>
  );
}
