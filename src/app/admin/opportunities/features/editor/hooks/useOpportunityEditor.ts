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
    // 基本情報
    category: formState.category,
    setCategory: formState.setCategory,
    title: formState.title,
    setTitle: formState.setTitle,
    summary: formState.summary,
    setSummary: formState.setSummary,
    description: formState.description,
    setDescription: formState.setDescription,

    // 主催・場所
    hostUserId: formState.hostUserId,
    setHostUserId: formState.setHostUserId,
    placeId: formState.placeId,
    setPlaceId: formState.setPlaceId,
    requireHostApproval: formState.requireHostApproval,
    setRequireHostApproval: formState.setRequireHostApproval,

    // 募集条件
    capacity: formState.capacity,
    setCapacity: formState.setCapacity,
    feeRequired: formState.feeRequired,
    setFeeRequired: formState.setFeeRequired,
    pointsRequired: formState.pointsRequired,
    setPointsRequired: formState.setPointsRequired,
    pointsToEarn: formState.pointsToEarn,
    setPointsToEarn: formState.setPointsToEarn,

    // 公開設定
    publishStatus: formState.publishStatus,
    setPublishStatus: formState.setPublishStatus,

    // 開催枠（slotManager から直接展開）
    slots: formState.slotManager.slots,
    addSlot: formState.slotManager.addSlot,
    addSlotsBatch: formState.slotManager.addSlotsBatch,
    updateSlot: formState.slotManager.updateSlot,
    removeSlot: formState.slotManager.removeSlot,
    cancelSlot,

    // 画像（imageManager から直接展開）
    images: formState.imageManager.images,
    handleImageSelect: formState.imageManager.handleImageSelect,
    removeImage: formState.imageManager.removeImage,

    // バリデーション
    errors: formState.validation.errors,

    // 保存
    handleSave,
    saving,
  };
};
