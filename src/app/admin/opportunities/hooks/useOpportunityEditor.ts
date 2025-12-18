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
import { OpportunityFormData, SlotData, ImageData } from "../types";

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

  // 開催枠
  const [slots, setSlots] = useState<SlotData[]>(initialData?.slots ?? []);

  // 画像
  const [images, setImages] = useState<ImageData[]>(initialData?.images ?? []);

  // 公開設定
  const [publishStatus, setPublishStatus] = useState<GqlPublishStatus>(
    initialData?.publishStatus ?? GqlPublishStatus.Published
  );

  // ========== GraphQL Mutations ==========
  const [createOpportunity, createResult] = useCreateOpportunityMutation();
  const [updateContent, updateContentResult] = useUpdateOpportunityContentMutation();
  const [updateSlots, updateSlotsResult] = useUpdateOpportunitySlotsBulkMutation();

  const saving = createResult.loading || updateContentResult.loading || updateSlotsResult.loading;

  // ========== 画像管理 ==========
  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (images.length + files.length > 5) {
      toast.error("画像は最大5枚までです");
      return;
    }

    const newImages: ImageData[] = files.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const removed = prev[index];
      if (removed.url.startsWith("blob:")) {
        URL.revokeObjectURL(removed.url);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  // クリーンアップ
  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img.url.startsWith("blob:")) {
          URL.revokeObjectURL(img.url);
        }
      });
    };
  }, []);

  // ========== スロット管理 ==========
  const addSlot = () => {
    setSlots((prev) => [...prev, { startAt: "", endAt: "" }]);
  };

  const addSlotsBatch = (newSlots: { startAt: string; endAt: string }[]) => {
    setSlots((prev) => [...prev, ...newSlots]);
  };

  const updateSlot = (index: number, field: keyof SlotData, value: string) => {
    setSlots((prev) => prev.map((slot, i) => (i === index ? { ...slot, [field]: value } : slot)));
  };

  const removeSlot = (index: number) => {
    setSlots((prev) => prev.filter((_, i) => i !== index));
  };

  // ========== 保存処理 ==========
  const handleSave = async (e: FormEvent) => {
    e.preventDefault();

    // バリデーション
    if (!title.trim()) {
      toast.error("タイトルを入力してください");
      return;
    }
    if (!summary.trim()) {
      toast.error("概要を入力してください");
      return;
    }
    if (!hostUserId) {
      toast.error("主催者を選択してください");
      return;
    }
    if (images.length < 2) {
      toast.error("最低2枚の画像を登録してください");
      return;
    }
    if (images.length > 5) {
      toast.error("画像は最大5枚までです");
      return;
    }
    if (slots.length === 0) {
      toast.error("最低1つの開催枠が必要です");
      return;
    }
    if (slots.some((slot) => !slot.startAt || !slot.endAt)) {
      toast.error("すべての開催枠の日時を入力してください");
      return;
    }

    try {
      // スロット変換
      const slotsInput = slots.map((slot) => ({
        startsAt: dayjs(slot.startAt).toISOString(),
        endsAt: dayjs(slot.endAt).toISOString(),
        capacity,
        ...(slot.id ? { id: slot.id } : {}),
      }));

      // 画像変換
      const imagesInput = images.map((img) => ({
        file: img.file,
        alt: img.alt || "",
        caption: img.caption || "",
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
    setTitle,
    summary,
    setSummary,
    description,
    setDescription,

    // 主催・場所
    hostUserId,
    setHostUserId,
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

    // 開催枠
    slots,
    addSlot,
    addSlotsBatch,
    updateSlot,
    removeSlot,

    // 画像
    images,
    handleImageSelect,
    removeImage,

    // 公開設定
    publishStatus,
    setPublishStatus,

    // 保存
    handleSave,
    saving,
  };
};
