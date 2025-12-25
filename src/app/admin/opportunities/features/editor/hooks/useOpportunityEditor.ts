"use client";

import { useCallback } from "react";
import { OpportunityFormData } from "../types/form";
import { useOpportunityFormState } from "./useOpportunityFormState";
import { useOpportunitySave } from "./useOpportunitySave";
import { useSlotActions } from "../../slots/hooks/useSlotActions";

type UseOpportunityEditorOptions = {
  mode: "create" | "update";
  opportunityId?: string;
  initialData?: Partial<OpportunityFormData>;
};

export const useOpportunityEditor = ({
  mode,
  opportunityId,
  initialData,
}: UseOpportunityEditorOptions) => {
  // フォーム状態管理
  const formState = useOpportunityFormState(initialData);

  // 保存処理
  const { handleSave, saving } = useOpportunitySave({
    mode,
    opportunityId,
    formState,
  });

  // スロットアクション
  const slotActions = useSlotActions({
    opportunityId,
    capacity: formState.capacity,
    onSlotUpdate: formState.slotManager.updateSlot,
  });

  // 開催中止処理
  const cancelSlot = useCallback(
    async (index: number, message?: string) => {
      const slot = formState.slotManager.slots[index];
      await slotActions.cancelSlot(index, slot, message);
    },
    [formState.slotManager.slots, slotActions]
  );

  return {
    // フォーム状態をそのまま展開
    ...formState,

    // スロット操作に cancelSlot を追加
    cancelSlot,

    // 保存処理
    handleSave,
    saving,
  };
};
