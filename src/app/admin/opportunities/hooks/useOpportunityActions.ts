// src/app/admin/opportunities/hooks/useOpportunityActions.ts

"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "react-toastify";

interface UseOpportunityActionsReturn {
  handleEdit: (opportunityId: string) => void;
  handleView: (opportunityId: string) => void;
  handleCopyUrl: (opportunityId: string) => void;
  handleBackToDraft: (opportunityId: string) => Promise<void>;
  handleDeleteDraft: (opportunityId: string) => Promise<void>;
}

export function useOpportunityActions(): UseOpportunityActionsReturn {
  const router = useRouter();

  /**
   * 編集ページへ遷移
   */
  const handleEdit = useCallback(
    (opportunityId: string) => {
      router.push(`/admin/opportunities/${opportunityId}/edit`);
    },
    [router]
  );

  /**
   * 詳細ページへ遷移
   */
  const handleView = useCallback(
    (opportunityId: string) => {
      router.push(`/admin/opportunities/${opportunityId}`);
    },
    [router]
  );

  /**
   * 募集URLをクリップボードにコピー
   */
  const handleCopyUrl = useCallback(
    (opportunityId: string) => {
      const url = `${window.location.origin}/opportunities/${opportunityId}`;

      navigator.clipboard
        .writeText(url)
        .then(() => {
          toast.success("URLをコピーしました");
        })
        .catch(() => {
          toast.error("URLのコピーに失敗しました");
        });
    },
    []
  );

  /**
   * 下書きに戻す（TODO: GraphQL mutation実装）
   */
  const handleBackToDraft = useCallback(
    async (opportunityId: string) => {
      // TODO: GraphQL mutationを実装
      console.log("下書きに戻す:", opportunityId);
      toast.info("この機能は実装予定です");

      // 実装例:
      // try {
      //   await updateOpportunityPublishStatus({
      //     variables: {
      //       id: opportunityId,
      //       publishStatus: GqlPublishStatus.Private,
      //     },
      //   });
      //   toast.success("下書きに戻しました");
      //   refetch();
      // } catch (error) {
      //   toast.error("下書きに戻せませんでした");
      // }
    },
    []
  );

  /**
   * 下書きを削除（TODO: GraphQL mutation実装 + 確認ダイアログ）
   */
  const handleDeleteDraft = useCallback(
    async (opportunityId: string) => {
      // TODO: AlertDialogで確認を追加
      // TODO: GraphQL mutationを実装
      console.log("下書き削除:", opportunityId);
      toast.info("この機能は実装予定です");

      // 実装例:
      // const confirmed = await showConfirmDialog({
      //   title: "下書きを削除しますか？",
      //   description: "この操作は取り消せません。",
      // });
      //
      // if (!confirmed) return;
      //
      // try {
      //   await deleteOpportunity({
      //     variables: { id: opportunityId },
      //   });
      //   toast.success("下書きを削除しました");
      //   refetch();
      // } catch (error) {
      //   toast.error("下書きの削除に失敗しました");
      // }
    },
    []
  );

  return {
    handleEdit,
    handleView,
    handleCopyUrl,
    handleBackToDraft,
    handleDeleteDraft,
  };
}
