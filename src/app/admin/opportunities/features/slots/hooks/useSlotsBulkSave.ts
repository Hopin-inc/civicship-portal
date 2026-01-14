import { useCallback } from "react";
import { toast } from "react-toastify";
import { useUpdateOpportunitySlotsBulkMutation } from "@/types/graphql";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";
import { SlotData } from "../../shared/types/slot";
import { convertSlotToDates } from "../../shared/utils/dateFormat";

interface UseSlotsBulkSaveOptions {
  opportunityId: string;
}

/**
 * 開催枠のみを保存する専用フック
 * updateモード専用（opportunityIdが必要）
 */
export const useSlotsBulkSave = ({
  opportunityId,
}: UseSlotsBulkSaveOptions) => {
  const { communityId } = useCommunityConfig();
  const [updateSlots, { loading }] = useUpdateOpportunitySlotsBulkMutation();

  const handleSave = useCallback(
    async (slots: SlotData[], capacity: number) => {
      // 新規作成スロット（idなし）
      const slotsToCreate = slots
        .filter((slot) => !slot.id)
        .map((slot) => ({
          ...convertSlotToDates(slot),
          capacity,
        }));

      // 既存スロット更新（idあり）
      const slotsToUpdate = slots
        .filter((slot): slot is typeof slot & { id: string } => !!slot.id)
        .map((slot) => ({
          id: slot.id,
          ...convertSlotToDates(slot),
        }));

      try {
        await updateSlots({
          variables: {
            input: {
              opportunityId,
              create: slotsToCreate.length > 0 ? slotsToCreate : undefined,
              update: slotsToUpdate.length > 0 ? slotsToUpdate : undefined,
            },
            permission: {
              communityId,
              opportunityId,
            },
          },
        });

        toast.success("開催枠を保存しました");
        return true;
      } catch (error) {
        console.error(error);
        toast.error("開催枠の保存に失敗しました");
        return false;
      }
    },
    [opportunityId, communityId, capacity, updateSlots]
  );

  return {
    handleSave,
    saving: loading,
  };
};
