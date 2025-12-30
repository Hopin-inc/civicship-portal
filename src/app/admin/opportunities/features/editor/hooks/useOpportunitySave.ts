"use client";

import { FormEvent, useCallback } from "react";
import { toast } from "react-toastify";
import {
  GqlOpportunityCategory,
  useCreateOpportunityMutation,
  useUpdateOpportunityContentMutation,
  useUpdateOpportunitySlotsBulkMutation,
} from "@/types/graphql";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { isNewImage } from "../types/form";
import { MIN_IMAGES, MAX_IMAGES } from "../constants/form";
import { convertSlotToDates } from "../../shared/utils/dateFormat";
import { OpportunityFormState } from "./useOpportunityFormState";

export type UseOpportunitySaveOptions = {
  mode: "create" | "update";
  opportunityId?: string;
  formState: OpportunityFormState;
};

export const useOpportunitySave = ({
  mode,
  opportunityId,
  formState,
}: UseOpportunitySaveOptions) => {
  // ========== GraphQL Mutations ==========
  const [createOpportunity, createResult] = useCreateOpportunityMutation({
    refetchQueries: ["GetAdminOpportunities"],
    awaitRefetchQueries: true,
    onCompleted: () => {
      // キャッシュを完全にクリアして確実に最新データを取得
      createResult.client.cache.evict({ fieldName: "opportunities" });
      createResult.client.cache.gc();
    },
  });
  const [updateContent, updateContentResult] = useUpdateOpportunityContentMutation();
  const [updateSlots, updateSlotsResult] = useUpdateOpportunitySlotsBulkMutation();

  const saving = createResult.loading || updateContentResult.loading || updateSlotsResult.loading;

  // ========== 保存処理 ==========
  const handleSave = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      const {
        validation,
        title,
        summary,
        hostUserId,
        imageManager,
        slotManager,
        capacity,
        category,
        feeRequired,
        pointsRequired,
        pointsToEarn,
        placeId,
        description,
        requireHostApproval,
        publishStatus,
      } = formState;

      // Tier 1: 必須項目のバリデーション
      if (!validation.validateForm(title, summary, hostUserId)) {
        return;
      }

      // Tier 2: ドメイン制約のバリデーション
      if (MIN_IMAGES > 0 && imageManager.images.length < MIN_IMAGES) {
        toast.error(`最低${MIN_IMAGES}枚の画像を登録してください`);
        return;
      }
      if (imageManager.images.length > MAX_IMAGES) {
        toast.error(`画像は最大${MAX_IMAGES}枚までです`);
        return;
      }
      if (slotManager.slots.some((slot) => !slot.startAt || !slot.endAt)) {
        toast.error("すべての開催枠の日時を入力してください");
        return;
      }

      try {
      // スロット変換（create用：capacityを含む）
      const slotsInputForCreate = slotManager.slots
        .filter((slot) => !slot.id)
        .map((slot) => ({
          ...convertSlotToDates(slot),
          capacity,
        }));

      // スロット変換（update用：capacityを含まない）
      const slotsInputForUpdate = slotManager.slots
        .filter((slot): slot is typeof slot & { id: string } => !!slot.id)
        .map((slot) => ({
          id: slot.id,
          ...convertSlotToDates(slot),
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
            pointsToEarn: undefined,
          }
        : {
            feeRequired: undefined,
            pointsRequired: undefined,
            pointsToEarn,
          };

      const commonInput = {
        category,
        title,
        description: summary,
        body: description,
        placeId: placeId ?? undefined,
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
              slots: slotsInputForCreate,
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
            permission: {
              communityId: COMMUNITY_ID,
              opportunityId: opportunityId!,
            },
          },
        });

        // スロット更新
        await updateSlots({
          variables: {
            input: {
              opportunityId: opportunityId!,
              create: slotsInputForCreate.length > 0 ? slotsInputForCreate : undefined,
              update: slotsInputForUpdate.length > 0 ? slotsInputForUpdate : undefined,
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
    },
    [
      mode,
      opportunityId,
      formState,
      createOpportunity,
      updateContent,
      updateSlots,
    ]
  );

  return {
    handleSave,
    saving,
  };
};
