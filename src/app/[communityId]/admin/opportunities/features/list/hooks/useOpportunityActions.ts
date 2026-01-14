// src/app/admin/opportunities/hooks/useOpportunityActions.ts

"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "react-toastify";
import {
  GqlPublishStatus,
  useDeleteOpportunityMutation,
  useSetPublishStatusMutation,
} from "@/types/graphql";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";

interface UseOpportunityActionsReturn {
  handleEdit: (opportunityId: string) => void;
  handleView: (opportunityId: string) => void;
  handleCopyUrl: (opportunityId: string) => void;
  handleBackToDraft: (opportunityId: string) => Promise<void>;
  handleDeleteDraft: (opportunityId: string) => Promise<void>;
}

export function useOpportunityActions(refetch?: () => void): UseOpportunityActionsReturn {
  const router = useRouter();
  const { communityId } = useCommunityConfig();
  const [setPublishStatus] = useSetPublishStatusMutation();
  const [deleteOpportunity] = useDeleteOpportunityMutation();

  /**
   * 編集ページへ遷移
   */
  const handleEdit = useCallback(
    (opportunityId: string) => {
      router.push(`/admin/opportunities/${opportunityId}/edit`);
    },
    [router],
  );

  /**
   * 詳細ページへ遷移
   */
  const handleView = useCallback(
    (opportunityId: string) => {
      router.push(`/admin/opportunities/${opportunityId}`);
    },
    [router],
  );

  /**
   * 募集URLをクリップボードにコピー
   */
  const handleCopyUrl = useCallback((opportunityId: string) => {
    const url = `${window.location.origin}/opportunities/${opportunityId}`;

    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success("URLをコピーしました");
      })
      .catch(() => {
        toast.error("URLのコピーに失敗しました");
      });
  }, []);

  /**
   * 下書きに戻す
   */
  const handleBackToDraft = useCallback(
    async (opportunityId: string) => {
      try {
        await setPublishStatus({
          variables: {
            id: opportunityId,
            input: { publishStatus: GqlPublishStatus.Private },
            permission: { communityId, opportunityId },
          },
        });
        toast.success("下書きに戻しました");
        refetch?.();
      } catch (error) {
        console.error(error);
        toast.error("下書きに戻せませんでした");
      }
    },
    [communityId, setPublishStatus, refetch],
  );

  /**
   * 下書きを削除
   */
  const handleDeleteDraft = useCallback(
    async (opportunityId: string) => {
      // 確認ダイアログ
      if (!window.confirm("下書きを削除しますか？この操作は取り消せません。")) {
        return;
      }

      try {
        await deleteOpportunity({
          variables: {
            id: opportunityId,
            permission: { communityId, opportunityId },
          },
        });
        toast.success("下書きを削除しました");
        refetch?.();
      } catch (error) {
        console.error(error);
        toast.error("下書きの削除に失敗しました");
      }
    },
    [communityId, deleteOpportunity, refetch],
  );

  return {
    handleEdit,
    handleView,
    handleCopyUrl,
    handleBackToDraft,
    handleDeleteDraft,
  };
}
