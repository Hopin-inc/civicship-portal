"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import {
  GqlOpportunityCategory,
  GqlPublishStatus,
  useCreateOpportunityMutation,
  useUpdateOpportunityContentMutation,
  useUpdateOpportunitySlotsBulkMutation,
} from "@/types/graphql";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { OpportunityFormData, SlotData, ImageData, ValidationErrors, isNewImage } from "../types";
import { useImageManager } from "./useImageManager";
import { useSlotManager } from "./useSlotManager";
import { useOpportunityValidation } from "./useOpportunityValidation";

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
  // ========== フック統合 ==========
  const imageManager = useImageManager(initialData?.images);
  const slotManager = useSlotManager(initialData?.slots);
  const validation = useOpportunityValidation();

  // ========== State管理 ==========

  // 基本情報
  const [category, setCategory] = useState<GqlOpportunityCategory>(
    initialData?.category ?? GqlOpportunityCategory.Activity
  );
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [summary, setSummary] = useState(initialData?.summary ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");

  // 主催・場所
  const [hostUserId, setHostUserId] = useState(initialData?.hostUserId ?? "");
  const [placeId, setPlaceId] = useState<string | null>(initialData?.placeId ?? null);
  const [requireHostApproval, setRequireHostApproval] = useState(
    initialData?.requireHostApproval ?? false
  );

  // 募集条件
  const [capacity, setCapacity] = useState(initialData?.capacity ?? 10);
  const [feeRequired, setFeeRequired] = useState(initialData?.feeRequired ?? 0);
  const [pointsRequired, setPointsRequired] = useState(initialData?.pointsRequired ?? 0);
  const [pointsToEarn, setPointsToEarn] = useState(initialData?.pointsToEarn ?? 0);

  // 公開設定
  const [publishStatus, setPublishStatus] = useState<GqlPublishStatus>(
    initialData?.publishStatus ?? GqlPublishStatus.Published
  );

  // ========== GraphQL Mutations ==========
  const [createOpportunity, createResult] = useCreateOpportunityMutation();
  const [updateContent, updateContentResult] = useUpdateOpportunityContentMutation();
  const [updateSlots, updateSlotsResult] = useUpdateOpportunitySlotsBulkMutation();

  const saving = createResult.loading || updateContentResult.loading || updateSlotsResult.loading;

  // ========== エラー自動クリア付きセッター ==========
  const setTitleWithClear = (value: string) => {
    setTitle(value);
    if (validation.errors.title) {
      validation.clearError('title');
    }
  };

  const setSummaryWithClear = (value: string) => {
    setSummary(value);
    if (validation.errors.summary) {
      validation.clearError('summary');
    }
  };

  const setHostUserIdWithClear = (value: string) => {
    setHostUserId(value);
    if (validation.errors.hostUserId) {
      validation.clearError('hostUserId');
    }
  };

  // ========== 保存処理 ==========
  const handleSave = async (e: FormEvent) => {
    e.preventDefault();

    // Tier 1: 必須項目のバリデーション
    if (!validation.validateForm(title, summary, hostUserId)) {
      return;
    }

    // Tier 2: ドメイン制約のバリデーション
    if (imageManager.images.length < 2) {
      toast.error("最低2枚の画像を登録してください");
      return;
    }
    if (imageManager.images.length > 5) {
      toast.error("画像は最大5枚までです");
      return;
    }
    if (slotManager.slots.some((slot) => !slot.startAt || !slot.endAt)) {
      toast.error("すべての開催枠の日時を入力してください");
      return;
    }

    try {
      // スロット変換
      const slotsInput = slotManager.slots.map((slot) => ({
        startsAt: dayjs(slot.startAt).toISOString(),
        endsAt: dayjs(slot.endAt).toISOString(),
        capacity,
        ...(slot.id ? { id: slot.id } : {}),
      }));

      // 画像変換（新規画像のみ送信）
      const imagesInput = imageManager.images
        .filter(isNewImage)
        .map((img) => ({
          file: img.file,
          alt: "",
          caption: "",
        }));

      // カテゴリ別入力
      const isActivity = category === GqlOpportunityCategory.Activity;
      const categorySpecificInput = isActivity
        ? {
            feeRequired,
            pointsRequired,
            pointsToEarn: null,
          }
        : {
            feeRequired: null,
            pointsRequired: null,
            pointsToEarn,
          };

      const commonInput = {
        category,
        title,
        description: summary,
        body: description,
        placeId,
        createdBy: hostUserId,
        requireApproval: requireHostApproval,
        images: imagesInput,
        publishStatus,
      };

      if (mode === "create") {
        const result = await createOpportunity({
          variables: {
            input: {
              ...commonInput,
              ...categorySpecificInput,
              slots: slotsInput,
            },
            permission: { communityId: COMMUNITY_ID },
          },
        });

        toast.success("募集を作成しました");
        return result.data?.opportunityCreate?.opportunity?.id;
      } else {
        // 更新
        await updateContent({
          variables: {
            id: opportunityId!,
            input: {
              ...commonInput,
              ...categorySpecificInput,
            },
            permission: { communityId: COMMUNITY_ID },
          },
        });

        // スロット更新
        const createSlots = slotsInput.filter((s) => !s.id);
        const updateSlotsData = slotsInput.filter((s) => s.id);

        await updateSlots({
          variables: {
            input: {
              opportunityId: opportunityId!,
              create: createSlots.length > 0 ? createSlots : undefined,
              update: updateSlotsData.length > 0 ? updateSlotsData : undefined,
            },
            permission: {
              communityId: COMMUNITY_ID,
              opportunityId: opportunityId!,
            },
          },
        });

        toast.success("募集情報を更新しました");
        return opportunityId;
      }
    } catch (error) {
      console.error(error);
      toast.error("保存に失敗しました");
      return undefined;
    }
  };

  return {
    // 基本情報
    category,
    setCategory,
    title,
    setTitle: setTitleWithClear,
    summary,
    setSummary: setSummaryWithClear,
    description,
    setDescription,

    // 主催・場所
    hostUserId,
    setHostUserId: setHostUserIdWithClear,
    placeId,
    setPlaceId,
    requireHostApproval,
    setRequireHostApproval,

    // 募集条件
    capacity,
    setCapacity,
    feeRequired,
    setFeeRequired,
    pointsRequired,
    setPointsRequired,
    pointsToEarn,
    setPointsToEarn,

    // 開催枠（slotManager から）
    slots: slotManager.slots,
    addSlot: slotManager.addSlot,
    addSlotsBatch: slotManager.addSlotsBatch,
    updateSlot: slotManager.updateSlot,
    removeSlot: slotManager.removeSlot,

    // 画像（imageManager から）
    images: imageManager.images,
    handleImageSelect: imageManager.handleImageSelect,
    removeImage: imageManager.removeImage,

    // 公開設定
    publishStatus,
    setPublishStatus,

    // バリデーション（validation から）
    errors: validation.errors,

    // 保存
    handleSave,
    saving,
  };
};
