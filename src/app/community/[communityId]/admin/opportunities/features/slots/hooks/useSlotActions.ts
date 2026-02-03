import { useCallback } from "react";
import { toast } from "react-toastify";
import { ApolloError } from "@apollo/client";
import {
  GqlOpportunitySlotHostingStatus,
  useSetOpportunitySlotHostingStatusMutation,
} from "@/types/graphql";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";
import { SlotData } from "../../shared/types/slot";
import { convertSlotToDates } from "../../shared/utils/dateFormat";

interface UseSlotActionsOptions {
  opportunityId?: string;
  capacity: number;
  onSlotUpdate: <K extends keyof SlotData>(index: number, field: K, value: SlotData[K]) => void;
  onSlotUpdateSilent: <K extends keyof SlotData>(index: number, field: K, value: SlotData[K]) => void;
}

/**
 * スロットのアクション（開催中止など）を管理するフック
 */
export const useSlotActions = ({
  opportunityId,
  capacity,
  onSlotUpdate,
  onSlotUpdateSilent,
}: UseSlotActionsOptions) => {
  const { communityId } = useCommunityConfig();
  const [setSlotHostingStatus] = useSetOpportunitySlotHostingStatusMutation();

  /**
   * スロットを開催中止にする
   */
  const cancelSlot = useCallback(
    async (index: number, slot: SlotData, message?: string) => {
      if (!slot.id) {
        toast.error("この開催枠は中止できません");
        return;
      }

      if (!opportunityId) {
        toast.error("募集情報が見つかりません");
        return;
      }

      try {
        await setSlotHostingStatus({
          variables: {
            id: slot.id,
            input: {
              status: GqlOpportunitySlotHostingStatus.Cancelled,
              ...convertSlotToDates(slot),
              capacity,
              // TODO: バックエンドがcancellationMessageをサポートしたら有効化
              // cancellationMessage: message,
            },
            permission: {
              communityId,
              opportunityId,
            },
          },
        });

        // ローカルステートを更新（変更フラグは立てない）
        onSlotUpdateSilent(index, "hostingStatus", GqlOpportunitySlotHostingStatus.Cancelled);
        toast.success("開催を中止しました");
      } catch (error) {
        console.error("Slot cancellation failed:", error);

        // エラーの種類に応じた詳細なメッセージ
        if (error instanceof ApolloError) {
          const errorCode = error.graphQLErrors[0]?.extensions?.code;

          if (errorCode === "PERMISSION_DENIED") {
            toast.error("開催中止の権限がありません");
          } else if (errorCode === "NOT_FOUND") {
            toast.error("開催枠が見つかりません");
          } else if (errorCode === "INVALID_STATE") {
            toast.error("この開催枠は中止できない状態です");
          } else {
            toast.error("開催中止に失敗しました");
          }
        } else {
          toast.error("開催中止に失敗しました");
        }
      }
    },
    [opportunityId, communityId, capacity, setSlotHostingStatus, onSlotUpdateSilent]
  );

  return {
    cancelSlot,
  };
};
