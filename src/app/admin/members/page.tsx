"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { GqlRole, GqlUser } from "@/types/graphql";
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
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared";
import { useMemberWithDidSearch } from "../credentials/hooks/useMemberWithDidSearch";
import SearchForm from "@/components/shared/SearchForm";

export default function MembersPage() {
  const communityId = COMMUNITY_ID;
  const { user: currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [input, setInput] = useState("");
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

  const { membershipListData, error, refetch, loading, hasNextPage, isLoadingMore, loadMoreRef } =
    useMembershipQueries(communityId);
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

  const { data: searchMembershipData } = useMemberWithDidSearch(communityId, members, {
    searchQuery,
  });

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
        toast.error(err instanceof Error ? err.message : "不明なエラーが発生しました");
      } finally {
        setIsLoading(false);
      }
    },
    [communityId],
  );

  const refetchRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  if (loading && !isLoadingMore) return <LoadingIndicator fullScreen />;
  if (error) return <ErrorState title={"メンバーを読み込めませんでした"} refetchRef={refetchRef} />;

  return (
    <div className="py-4">
      <SearchForm value={input} onInputChange={setInput} onSearch={setSearchQuery} placeholder={"名前・DIDで検索"} />
      <div className="flex flex-col gap-4 mt-4">
        <span className="text-muted-foreground text-label-xs ml-4">
          操作を行うには管理者権限が必要です
        </span>

        {searchMembershipData?.length === 0 && (
          <p className="text-sm text-muted-foreground">一致するメンバーが見つかりません</p>
        )}

        {searchMembershipData?.map((user) => {
          const membership = members.find((m: any) => m?.user.id === user.id);
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
        {hasNextPage && (
          <div ref={loadMoreRef} className="py-4 text-center mt-4">
            {isLoadingMore ? (
              <div className="py-2">
                <LoadingIndicator fullScreen={false} />
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">スクロールしてさらに読み込み...</p>
            )}
          </div>
        )}
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
    </div>
  );
}
