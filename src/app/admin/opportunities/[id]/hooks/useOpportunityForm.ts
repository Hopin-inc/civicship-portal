"use client";

import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import {
  useCreateOpportunityMutation,
  useUpdateOpportunityContentMutation,
  useUpdateOpportunitySlotsBulkMutation,
} from "@/types/graphql";
import { toast } from "react-toastify";
import { opportunityFormSchema, OpportunityFormValues } from "../opportunityForm";
import { COMMUNITY_ID } from "@/lib/communities/metadata";

type UseOpportunityFormOptions = {
  mode: "create" | "update";
  opportunityId?: string; // update のとき必須
};

export type OpportunityFormInstance = UseFormReturn<OpportunityFormValues> & {
  submit: (values: OpportunityFormValues) => Promise<string | undefined>;
  isSubmitting: boolean;
};

export const useOpportunityForm = (
  initialValues: OpportunityFormValues,
  options: UseOpportunityFormOptions,
): OpportunityFormInstance => {
  const [createOpportunity, createResult] = useCreateOpportunityMutation();
  const [updateOpportunityContent, updateContentResult] = useUpdateOpportunityContentMutation();
  const [updateOpportunitySlots, updateSlotsResult] = useUpdateOpportunitySlotsBulkMutation();

  const form = useForm<OpportunityFormValues>({
    resolver: zodResolver(opportunityFormSchema),
    defaultValues: initialValues,
    mode: "onBlur",
  });

  const isSubmitting = createResult.loading || updateContentResult.loading || updateSlotsResult.loading;

  const submit = async (values: OpportunityFormValues): Promise<string | undefined> => {
    try {
      // slots の datetime-local → Unix 秒 変換 + capacity追加
      const slotsInput = values.slots.map((slot: any) => ({
        startsAt: dayjs(slot.startAt).unix(),
        endsAt: dayjs(slot.endAt).unix(),
        capacity: values.capacity,
        ...(slot.id ? { id: slot.id } : {}), // 既存スロットの場合はIDを含める
      }));

      // 画像入力の変換（TODO: ImageKit統合後に適切な形式に変更）
      const imagesInput = values.images.map((img: any) => ({
        file: img.file,
        alt: img.alt || "",
        caption: img.caption || "",
      }));

      if (options.mode === "update") {
        if (!options.opportunityId) throw new Error("opportunityId is required for update");

        // 1️⃣ コンテンツ更新
        await updateOpportunityContent({
          variables: {
            id: options.opportunityId,
            input: {
              category: values.category,
              title: values.title,
              description: values.summary,  // summary → description
              body: values.description ?? "",  // description → body
              feeRequired: values.pricePerPerson,  // pricePerPerson → feeRequired
              pointsToEarn: values.pointPerPerson,  // pointPerPerson → pointsToEarn
              placeId: values.placeId,
              createdBy: values.hostUserId,  // hostUserId → createdBy
              requireApproval: values.requireHostApproval,  // requireHostApproval → requireApproval
              images: imagesInput,
              publishStatus: values.publishStatus,
            },
            permission: {
              communityId: COMMUNITY_ID,
            },
          },
        });

        // 2️⃣ スロット更新（create/update分離）
        if (values.slots.length > 0) {
          const createSlots = slotsInput.filter((slot: any) => !slot.id);
          const updateSlots = slotsInput.filter((slot: any) => slot.id);

          await updateOpportunitySlots({
            variables: {
              input: {
                opportunityId: options.opportunityId,
                create: createSlots.length > 0 ? createSlots : undefined,
                update: updateSlots.length > 0 ? updateSlots : undefined,
                delete: undefined,  // TODO: スロット削除機能実装時に対応
              },
              permission: {
                communityId: COMMUNITY_ID,
                opportunityId: options.opportunityId,
              },
            },
          });
        }

        toast.success("募集情報を更新しました");
        return options.opportunityId;
      } else {
        // CREATE時は1回のmutationで完結
        const result = await createOpportunity({
          variables: {
            input: {
              category: values.category,
              title: values.title,
              description: values.summary,
              body: values.description ?? "",
              feeRequired: values.pricePerPerson,
              pointsToEarn: values.pointPerPerson,
              placeId: values.placeId,
              createdBy: values.hostUserId,
              requireApproval: values.requireHostApproval,
              images: imagesInput,
              publishStatus: values.publishStatus,
              slots: slotsInput,
            },
            permission: {
              communityId: COMMUNITY_ID,
            },
          },
        });

        const createdId = result.data?.opportunityCreate?.opportunity?.id;

        toast.success("募集を作成しました");
        return createdId;
      }
    } catch (error) {
      console.error(error);
      toast.error("保存に失敗しました。通信状況を確認して、もう一度お試しください。");
      return undefined;
    }
  };

  return Object.assign(form, {
    submit,
    isSubmitting,
  });
};
