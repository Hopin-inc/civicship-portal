"use client";

import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useCreateOpportunityMutation, useUpdateOpportunityMutation } from "@/types/graphql"; // ← 実際の mutation 名に合わせて変更
import { useToast } from "@/components/ui/use-toast";
import { opportunityFormSchema, OpportunityFormValues } from "../forms/opportunityForm";

type UseOpportunityFormOptions = {
  mode: "create" | "update";
  opportunityId?: string; // update のとき必須
};

export type OpportunityFormInstance = UseFormReturn<OpportunityFormValues> & {
  submit: (values: OpportunityFormValues) => Promise<void>;
  isSubmitting: boolean;
};

export const useOpportunityForm = (
  initialValues: OpportunityFormValues,
  options: UseOpportunityFormOptions,
): OpportunityFormInstance => {
  const { toast } = useToast();

  const [updateOpportunity, updateResult] = useUpdateOpportunityMutation();
  const [createOpportunity, createResult] = useCreateOpportunityMutation();

  const form = useForm<OpportunityFormValues>({
    resolver: zodResolver(opportunityFormSchema),
    defaultValues: initialValues,
    mode: "onBlur",
  });

  const isSubmitting = updateResult.loading || createResult.loading;

  const submit = async (values: OpportunityFormValues) => {
    try {
      // slots の datetime-local → Unix 秒 変換
      const slotsInput = values.slots.map((slot) => ({
        startAt: dayjs(slot.startAt).unix(),
        endAt: dayjs(slot.endAt).unix(),
      }));

      // 画像はプロジェクトの実際の型に合わせて調整してね
      // 例: images: { fileId: string; url: string }[] → fileId だけ送るなど
      const imagesInput = values.images;

      if (options.mode === "update") {
        if (!options.opportunityId) throw new Error("opportunityId is required for update");

        await updateOpportunity({
          variables: {
            id: options.opportunityId,
            input: {
              category: values.category,
              title: values.title,
              summary: values.summary,
              description: values.description ?? "",
              capacity: values.capacity,
              pricePerPerson: values.pricePerPerson,
              pointPerPerson: values.pointPerPerson,
              placeId: values.placeId,
              hostUserId: values.hostUserId,
              requireHostApproval: values.requireHostApproval,
              slots: slotsInput,
              images: imagesInput,
              publishStatus: values.publishStatus,
            },
          },
        });

        toast({
          title: "募集情報を更新しました",
          description: "変更内容が保存されました。",
        });
      } else {
        await createOpportunity({
          variables: {
            input: {
              category: values.category,
              title: values.title,
              summary: values.summary,
              description: values.description ?? "",
              capacity: values.capacity,
              pricePerPerson: values.pricePerPerson,
              pointPerPerson: values.pointPerPerson,
              placeId: values.placeId,
              hostUserId: values.hostUserId,
              requireHostApproval: values.requireHostApproval,
              slots: slotsInput,
              images: imagesInput,
              publishStatus: values.publishStatus,
            },
          },
        });

        toast({
          title: "募集を作成しました",
          description: "新しい募集が作成されました。",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "保存に失敗しました",
        description: "通信状況を確認して、もう一度お試しください。",
        variant: "destructive",
      });
    }
  };

  return Object.assign(form, {
    submit,
    isSubmitting,
  });
};
