"use client";

import { useState } from "react";
import { GqlOpportunityCategory, GqlPublishStatus } from "@/types/graphql";
import { OpportunityFormData } from "../../../types";
import { DEFAULT_CAPACITY } from "../../../constants/opportunity";
import { useImageManager } from "./useImageManager";
import { useSlotManager } from "../../slots/hooks/useSlotManager";
import { useOpportunityValidation } from "./useOpportunityValidation";
import { useValidatedState } from "./useValidatedState";

export type OpportunityFormState = {
  // 基本情報
  category: GqlOpportunityCategory;
  setCategory: (value: GqlOpportunityCategory) => void;
  title: string;
  setTitle: (value: string) => void;
  summary: string;
  setSummary: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;

  // 主催・場所
  hostUserId: string;
  setHostUserId: (value: string) => void;
  placeId: string | null;
  setPlaceId: (value: string | null) => void;
  requireHostApproval: boolean;
  setRequireHostApproval: (value: boolean) => void;

  // 募集条件
  capacity: number;
  setCapacity: (value: number) => void;
  feeRequired: number;
  setFeeRequired: (value: number) => void;
  pointsRequired: number;
  setPointsRequired: (value: number) => void;
  pointsToEarn: number;
  setPointsToEarn: (value: number) => void;

  // 公開設定
  publishStatus: GqlPublishStatus;
  setPublishStatus: (value: GqlPublishStatus) => void;

  // 外部フック
  imageManager: ReturnType<typeof useImageManager>;
  slotManager: ReturnType<typeof useSlotManager>;
  validation: ReturnType<typeof useOpportunityValidation>;
};

export const useOpportunityFormState = (
  initialData?: Partial<OpportunityFormData>
): OpportunityFormState => {
  // ========== フック統合 ==========
  const imageManager = useImageManager(initialData?.images);
  const slotManager = useSlotManager(initialData?.slots);
  const validation = useOpportunityValidation();

  // ========== State管理 ==========

  // 基本情報
  const [category, setCategory] = useState<GqlOpportunityCategory>(
    initialData?.category ?? GqlOpportunityCategory.Activity
  );
  const [title, setTitle] = useValidatedState(
    initialData?.title ?? "",
    'title',
    validation.errors,
    validation.clearError
  );
  const [summary, setSummary] = useValidatedState(
    initialData?.summary ?? "",
    'summary',
    validation.errors,
    validation.clearError
  );
  const [description, setDescription] = useState(initialData?.description ?? "");

  // 主催・場所
  const [hostUserId, setHostUserId] = useValidatedState(
    initialData?.hostUserId ?? "",
    'hostUserId',
    validation.errors,
    validation.clearError
  );
  const [placeId, setPlaceId] = useState<string | null>(initialData?.placeId ?? null);
  const [requireHostApproval, setRequireHostApproval] = useState(
    initialData?.requireHostApproval ?? false
  );

  // 募集条件
  const [capacity, setCapacity] = useState(initialData?.capacity ?? DEFAULT_CAPACITY);
  const [feeRequired, setFeeRequired] = useState(initialData?.feeRequired ?? 0);
  const [pointsRequired, setPointsRequired] = useState(initialData?.pointsRequired ?? 0);
  const [pointsToEarn, setPointsToEarn] = useState(initialData?.pointsToEarn ?? 0);

  // 公開設定
  const [publishStatus, setPublishStatus] = useState<GqlPublishStatus>(
    initialData?.publishStatus ?? GqlPublishStatus.Public
  );

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

    // 公開設定
    publishStatus,
    setPublishStatus,

    // 外部フック
    imageManager,
    slotManager,
    validation,
  };
};
