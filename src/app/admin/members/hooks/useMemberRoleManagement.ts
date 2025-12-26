"use client";

import { useCallback, useState } from "react";
import { GqlRole } from "@/types/graphql";
import { toast } from "react-toastify";
import { useMembershipCommand } from "./useMembershipMutations";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";

interface PendingRoleChange {
  userId: string;
  userName: string;
  newRole: GqlRole;
}

export function useMemberRoleManagement() {
  // Use runtime communityId from CommunityConfigContext
  const communityConfig = useCommunityConfig();
  const communityId = communityConfig?.communityId || "";
  const [pendingRoleChange, setPendingRoleChange] = useState<PendingRoleChange | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { assignOwner, assignManager, assignMember } = useMembershipCommand();

  const requestRoleChange = useCallback(
    (userId: string, userName: string, newRole: GqlRole, currentUserRole?: GqlRole) => {
      if (currentUserRole !== GqlRole.Owner) {
        toast.error("この操作を行う権限がありません");
        return;
      }
      setPendingRoleChange({ userId, userName, newRole });
    },
    [],
  );

  const confirmRoleChange = useCallback(async () => {
    if (!pendingRoleChange) return;

    const roleMutationMap = {
      OWNER: assignOwner,
      MANAGER: assignManager,
      MEMBER: assignMember,
    };

    const mutate = roleMutationMap[pendingRoleChange.newRole];
    if (!mutate) {
      toast.error("無効な権限です");
      setPendingRoleChange(null);
      return;
    }

    setIsLoading(true);
    try {
      const result = await mutate({ communityId: communityId, userId: pendingRoleChange.userId });
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
      setPendingRoleChange(null);
    }
  }, [pendingRoleChange, assignOwner, assignManager, assignMember, communityId]);

  const cancelRoleChange = useCallback(() => {
    setPendingRoleChange(null);
  }, []);

  return {
    pendingRoleChange,
    isLoading,
    requestRoleChange,
    confirmRoleChange,
    cancelRoleChange,
  };
}
